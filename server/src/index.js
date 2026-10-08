import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';


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

const uploadDir = path.resolve('uploads');
await fs.mkdir(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, done) => {
      done(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, done) => {
    if (file.mimetype.startsWith('image/')) done(null, true);
    else done(new Error('Please upload an image.'));
  }
});

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

app.put('/api/auth/me', requireAuth, async function (req, res) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }
  if (name.length > 150 || email.length > 255 || phone.length > 20) {
    return res.status(400).json({ message: 'One or more account fields exceed the allowed length.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  try {
    await pool.execute(
      'UPDATE users SET u_full_name = ?, u_email = ?, u_phone = ? WHERE user_id = ? AND u_is_active = 1',
      [name, email, phone || null, req.user.user_id]
    );
    const [rows] = await pool.execute(
      'SELECT user_id, u_full_name, u_email, u_phone, u_role FROM users WHERE user_id = ? AND u_is_active = 1 LIMIT 1',
      [req.user.user_id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    res.json({ message: 'Account details updated.', user: publicUser(rows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'That email address is already in use.' });
    }
    console.error('Error updating account details:', error);
    res.status(500).json({ message: 'Could not update account details.' });
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

//----------------------------------2. Get testemonilas of the users--------------------
app.get('/api/getStories', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ourstories ORDER BY Story_id DESC;'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Testemonials' });
  }
});

//---------------------------------3. add programs to the database--------------------
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

    await pool.query(
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
//-----------------Add stories/ Testimomials----------------------

//--------------Add a story
app.post('/api/AddStory', async (req, res) => {
  try {
    const {
      title,
      content,
      author_id,
      published_at,
      is_published
    } = req.body

    // Check required fields
    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required.'
      })
    }

    const sql = `
      INSERT INTO ourstories
      (title, content, author_id, published_at, is_published)
      VALUES (?, ?, ?, ?, ?)
    `

    const [result] = await pool.execute(sql, [
      title,
      content,
      author_id || null,
      published_at || new Date(),
      is_published ?? 1
    ])

    // Return the newly created story
    const [newStory] = await pool.execute(
      `SELECT * FROM ourstories WHERE Story_id = ?`,
      [result.insertId]
    )

    res.status(201).json(newStory[0])

  } catch (error) {
    console.error('Error adding story:', error)

    res.status(500).json({
      message: 'Unable to add story.'
    })
  }
})

//------------- Get all Homes --------------------
app.get('/api/getFosterHomes', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM fosterhomes ORDER BY foster_home_id DESC;'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Foster-homes!' });
  }
});

//------------- Get all Users --------------------
app.get('/api/getUsers', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users ORDER BY user_id DESC;'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve All users!' });
  }
});

//------------- Get Social Worker --------------------
app.get('/api/getWorkers', async function (_req, res) {
  try {
      const [workers] = await pool.query(`
      SELECT
        sw.social_worker_id,
        sw.user_id,
        u.u_full_name AS worker_name,
        sw.s_registration_number,
        sw.s_organisation_name,
        sw.s_office_location,
        sw.s_specialisation
      FROM social_workers sw
      INNER JOIN users u
      ON sw.user_id = u.user_id
      WHERE u.u_role = 'social_worker'
        AND u.u_is_active = 1
    `);
    res.json({
      data: workers
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch social workers'
    });
  }
});


//---------delete programs----------
app.delete('/api/deleteProgram/:id', async (req, res) => {
  try {
    // Get the program ID from the URL
    const ProgramID = req.params.id;
    const [result] = await db.query(
      'DELETE FROM adoption_programs WHERE program_id = ?',
      [ProgramID]
    );

    // Check if the program exists
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Program not found.'
      });
    }

    // Send success response
    res.status(200).json({
      message: 'Program deleted successfully.'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal server error.'
    });
  }
});


//--------------Add a Workers---
app.post('/api/AddWorker', async (req, res) => {
  try {
    const {
         s_fullName,
         s_registration_number,
         s_organisation_name,
         s_office_location,
         s_specialisation
    } = req.body

    // Check required fields
    if (!s_fullName || !s_registration_number 
      || !s_organisation_name || !s_office_location || !s_specialisation ) {
      return res.status(400).json({
        message: 'Please fill all information..'
      })
    }

    const sql = `
      INSERT INTO ourstories
      (title, content, author_id, published_at, is_published)
      VALUES (?, ?, ?, ?, ?)
    `

    const [result] = await pool.execute(sql, [
      title,
      content,
      author_id || null,
      published_at || new Date(),
      is_published ?? 1
    ])

    // Return the newly created story
    const [newStory] = await pool.execute(
      `SELECT * FROM ourstories WHERE Story_id = ?`,
      [result.insertId]
    )

    res.status(201).json(newStory[0])

  } catch (error) {
    console.error('Error adding story:', error)

    res.status(500).json({
      message: 'Unable to add story.'
    })
  }
})

//------Add image------------
app.post('/api/AddPictures', upload.single('image'), async (req, res) => {
  const altText = typeof req.body.alt_text === 'string' ? req.body.alt_text.trim() : '';

  if (!req.file || !altText) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ message: 'Image and description are required.' });
  }

  const imageUrl = '/uploads/'+ req.file.filename;

  try {
    const [result] = await pool.execute(
      'INSERT INTO gallery (image_type, image_url, alt_text) VALUES (?, ?, ?)',
      [req.file.mimetype, imageUrl, altText]
    );

    return res.status(201).json({
      gallery_id: result.insertId,
      image_url: imageUrl,
      alt_text: altText
    });
  } catch (error) {
    console.error(error);
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ message: 'Could not save the gallery image.' });
  }
});

app.post('/api/auth/logout', function (_req, res) {
  return res.clearCookie('auth_token').json({ ok: true });
});

app.listen(port, function () {
  console.log('API listening on http://localhost:' + port);
});

//----Get gallery----
app.get('/api/getPictures', async function (_req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id AS gallery_id, alt_text
       FROM gallery
       ORDER BY id DESC`
    );

    return res.json(rows);

  } catch (error) {
    console.error('Failed to retrieve pictures:', error);
    return res.status(500).json({
      error: 'Failed to retrieve pictures'
    });
  }
  
});

//-------------test
const childStatuses = [
  'in_care',
  'eligible_for_adoption',
  'matched',
  'adopted',
  'reunified'
];

app.post('/api/AddChild', async (req, res) => {
  const {
    C_fullName,
    c_reference_code,
    c_date_of_birth,
    c_gender,
    status,
    
  } = req.body;

  if (
    typeof C_fullName !== 'string' || !C_fullName.trim() ||
    typeof c_reference_code !== 'string' || !c_reference_code.trim() ||
    typeof c_date_of_birth !== 'string' || !c_date_of_birth.trim() ||
    typeof c_gender !== 'string' || !c_gender.trim()
  ) {
    return res.status(400).json({ message: 'Please provide all required child information.' });
  }

  const childStatus = status?.trim() || 'in_care';

  if (!childStatuses.includes(childStatus)) {
    return res.status(400).json({ message: 'Invalid child status.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO children
        (c_reference_code, c_Fullname, c_date_of_birth, c_gender, status, special_needs)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        c_reference_code.trim(),
        C_fullName.trim(),
        c_date_of_birth.trim(),
        c_gender.trim(),
        childStatus,
        typeof special_needs === 'string' && special_needs.trim()
          ? special_needs.trim()
          : null
      ]
    );

    return res.status(201).json({
      child_id: result.insertId,
      C_fullName: C_fullName.trim(),
      c_reference_code: c_reference_code.trim(),
      c_date_of_birth: c_date_of_birth.trim(),
      c_gender: c_gender.trim(),
      status: childStatus,
      special_needs: special_needs?.trim() || ''
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'That reference code is already in use.' });
    }

    console.error('Error inserting child:', error);
    return res.status(500).json({ message: 'Could not add the child.' });
  }
});

//--------------- The user sent enqueries----------
app.post('/api/AddEnquiry', async (req, res) => {
  try {
    const {
      enq_full_name,
      enq_email,
      enq_phone,
      enq_subject,
      enq_message,
      enq_status
    } = req.body;

    // Check required fields
    if (!enq_full_name || !enq_email || !enq_message) {
      return res.status(400).json({
        message: 'Name, email and message are required.'
      });
    }

    // Insert enquiry into MySQL
    const [result] = await pool.query(
      `INSERT INTO enquiries
       (full_name, email, phone, subject, message, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        enq_full_name,
        enq_email,
        enq_phone || null,
        enq_subject || null,
        enq_message,
        enq_status || 'new'
      ]
    );

    // Return the newly created enquiry
    const [rows] = await pool.query(
      `SELECT *
       FROM enquiries
       WHERE enquiry_id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Enquiry added successfully.',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error adding enquiry:', error);

    res.status(500).json({
      message: 'Failed to add enquiry.',
      error: error.message
    });
  }
});


//----------------update applicant

//--------------- The user sent enqueries----------
app.post('/api/updateAccount', requireAuth, async (req, res) => {
  try {
    const {
        s_marital_status,
        s_occupation,
        s_address,
        s_adoption_preferences
    } = req.body;

    // Check required fields
    if (!s_address || !s_marital_status) {
      return res.status(400).json({
        message: 'Please enter all information.'
      });
    }

    // Insert enquiry into MySQL
    await pool.query(
      `INSERT INTO applicants
       (user_id, s_marital_status, s_occupation, s_address, s_adoption_preferences)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       s_marital_status = VALUES(s_marital_status),
       s_occupation = VALUES(s_occupation),
       s_address = VALUES(s_address),
       s_adoption_preferences = VALUES(s_adoption_preferences)`,
      [
        req.user.user_id,
        s_marital_status,
        s_occupation,
        s_address,
        s_adoption_preferences
      ]
    );

    const [rows] = await pool.query(
      `SELECT *
       FROM applicants
       WHERE user_id = ?`,
      [req.user.user_id]
    );

    res.status(201).json({
      message: 'Applicant information updated successfully.',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error updating usr information:', error);

    res.status(500).json({
      message: 'Failed to update.',
      error: error.message
    });
  }
});