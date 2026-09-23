import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const jwtSecret = process.env.JWT_SECRET || 'development-secret-change-me';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'adoption_portal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const publicUser = function (user) {
  return {
    id: user.user_id,
    name: user.u_full_name,
    email: user.u_email,
    phone: user.u_phone,
    role: user.u_role
  };
};

const createToken = function (user) {
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

const requireAuth = async function (req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Please sign in to continue.' });
    }

    const payload = jwt.verify(token, jwtSecret);
    const [rows] = await pool.execute(
      'SELECT user_id, u_full_name, u_email, u_phone, u_role FROM users WHERE user_id = ? AND u_is_active = 1',
      [payload.userId]
    );

    if (!rows[0]) {
      return res.status(401).json({ message: 'Your account is not active.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};

app.get('/api/health', async function (_req, res) {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(503).json({ ok: false, database: 'unavailable' });
  }
});


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

    setAuthCookie(res, createToken(user));
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

    setAuthCookie(res, createToken(user));
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not sign you in.' });
  }
});

app.get('/api/auth/me', requireAuth, async function (req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, u_full_name, u_email, u_phone, u_role FROM users WHERE user_id = ? AND u_is_active = 1 LIMIT 1;',
      [req.user.user_id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    res.json({ user: publicUser(rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error.' });
  }
});

//-------------------Handle the retrievement of content for every page---------------

// 1.Get the programs
app.get('/api/getPrograms', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM adoption_programs WHERE ad_is_active = 1 ORDER BY ad_created_at DESC;'
    );
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Get testemonilas of the users
app.get('/api/getStories', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM news ORDER BY news_id DESC;'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Testemonials' });
  }
});

//3. add programs to the database
app.post('/api/AddPrograms', async (req, res) => {
  try {
    const {
      ad_name,
      ad_description,
      ad_eligibility_requirements
    } = req.body;

    if (!ad_name || !ad_description) {
      return res.status(400).json({
        message: 'Program name and description are required.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO adoption_programs (ad_name, ad_description, ad_eligibility_requirements) VALUES (?, ?, ?)',
      [
        ad_name.trim(),
        ad_description.trim(),
        ad_eligibility_requirements ? ad_eligibility_requirements.trim() : null
      ]
    );

    res.status(201).json({
      program_id: result.insertId,
      ad_name: ad_name.trim(),
      ad_description: ad_description.trim(),
      ad_eligibility_requirements: ad_eligibility_requirements ? ad_eligibility_requirements.trim() : null,
      ad_is_active: 1
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error inserting program'
    });
  }
});

app.post('/api/auth/logout', function (_req, res) {
  return res.clearCookie('auth_token').json({ ok: true });
});

app.listen(port, function () {
  console.log('API listening on http://localhost:' + port);
});