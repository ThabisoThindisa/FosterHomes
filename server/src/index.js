import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import handleGetRequests from './HandleGetRequest.js';
import upload, { uploadDir } from './FileUploading.js';
import registerUserAuthorization, { publicUser } from './userAuthorization.js';


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

await fs.mkdir(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

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

registerUserAuthorization(app, pool, jwtSecret);
handleGetRequests(app, pool, requireAuth, publicUser);

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
app.post('/api/updateAccount', async (req, res) => {
  try {
    const {
        user_id,
        s_marital_status,
        s_occupation,
        s_address,
        s_adoption_preferences
    } = req.body;

    // Check required fields
    if (!user_id || !s_address || !s_marital_status) {
      return res.status(400).json({
        message: 'Please enter all information.'
      });
    }

    // Insert enquiry into MySQL
    const [result] = await pool.query(
      `INSERT INTO applicants
       (user_id, s_marital_status, s_occupation, s_address, s_adoption_preferences)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       s_marital_status = VALUES(s_marital_status),
       s_occupation = VALUES(s_occupation),
       s_address = VALUES(s_address),
       s_adoption_preferences = VALUES(s_adoption_preferences)`,
      [
        user_id,
        s_marital_status,
        s_occupation,
        s_address,
        s_adoption_preferences
      ]
    );

    res.status(201).json({
      message: 'updated added successfully.',
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

//--------------- Add aplication----------
app.post('/api/makeAplication', requireAuth, async (req, res) => {
  try {
    const {
       social_worker_id,
       program_id,
       application_date,
       notes
    } = req.body;

    // Check required fields
    if (!social_worker_id || !program_id || !application_date) {
      return res.status(400).json({
        message: 'Missing information.'
      });
    }

    const [applicants] = await pool.execute(
      'SELECT applicant_id FROM applicants WHERE user_id = ? LIMIT 1',
      [req.user.user_id]
    );

    if (!applicants[0]) {
      return res.status(404).json({
        message: 'Applicant not found. Please update your account before applying.'
      });
    }

    // Insert adoption_applications into MySQL
    const [result] = await pool.query(
      'INSERT INTO adoption_applications (applicant_id, social_worker_id, program_id, application_date, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
       applicants[0].applicant_id,
       social_worker_id,
       program_id,
       application_date,
       'submitted',
       notes || null
      ]
    );

    // Return the newly created adoption_applications
    const [rows] = await pool.query(
      'SELECT * FROM adoption_applications WHERE application_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Application made successfully.',
      data: rows[0]
    });

  } catch (error) {
    console.error('Error adding Application:', error);

    res.status(500).json({
      message: 'Failed to add Application.',
      error: error.message
    });
  }
});