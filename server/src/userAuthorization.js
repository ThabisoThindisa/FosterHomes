import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const publicUser = function (user) {
  return {
    id: user.user_id,
    name: user.u_full_name,
    email: user.u_email,
    phone: user.u_phone,
    role: user.u_role
  };
};

const createToken = function (user, jwtSecret) {
  return jwt.sign({ userId: user.user_id }, jwtSecret, { expiresIn: '7d' });
};

const setAuthCookie = function (res, token) {
  return res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export default function registerUserAuthorization(app, pool, jwtSecret) {
  app.post('/api/auth/register', async function (req, res) {
    const { fullName, birthId, email, phone, password } = req.body;

    if (!fullName || !birthId || !email || !password) {
      return res.status(400).json({ message: 'Full name, birth ID, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [existing] = await connection.query(
        'SELECT user_id FROM users WHERE u_email = ? OR u_BirthID = ? LIMIT 1;',
        [email.trim().toLowerCase(), birthId.trim()]
      );

      if (existing.length) {
        await connection.rollback();
        return res.status(409).json({ message: 'An account with that email or birth ID already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const [result] = await connection.query(
        'INSERT INTO users (u_full_name, u_BirthID, u_email, u_password_hash, u_phone, u_role) VALUES (?, ?, ?, ?, ?, ?);',
        [
          fullName.trim(),
          birthId.trim(),
          email.trim().toLowerCase(),
          passwordHash,
          phone && phone.trim ? phone.trim() : null,
          'adoptive_parent'
        ]
      );

      await connection.query(
        'INSERT INTO applicants (user_id) VALUES (?);',
        [result.insertId]
      );

      await connection.commit();

      const user = {
        user_id: result.insertId,
        u_full_name: fullName.trim(),
        u_email: email.trim().toLowerCase(),
        u_phone: phone && phone.trim ? phone.trim() : null,
        u_role: 'adoptive_parent'
      };

      setAuthCookie(res, createToken(user, jwtSecret));
      res.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error(error);
      res.status(500).json({ message: 'Could not create the account.' });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });

  app.post('/api/auth/login', async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE u_email = ? AND u_is_active = 1 LIMIT 1',
        [email.trim().toLowerCase()]
      );

      const user = rows[0];
      if (!user || !(await bcrypt.compare(password, user.u_password_hash))) {
        return res.status(401).json({ message: 'Email or password is incorrect.' });
      }

      setAuthCookie(res, createToken(user, jwtSecret));
      res.json({ user: publicUser(user) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Could not sign you in.' });
    }
  });
}
