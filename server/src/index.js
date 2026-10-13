import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import handleGetRequests from './HandleGetRequest.js';
import HandleDeleteRequests from './HandleDeleteRequests.js'
import HandleAdd from './HandleAdd.js'
import { uploadDir } from './FileUploading.js';
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

//-----------Organise the files based on their functionality.-----------------
registerUserAuthorization(app, pool, jwtSecret);
handleGetRequests(app, pool, requireAuth, publicUser);
HandleDeleteRequests(app, pool);
HandleAdd(app, pool, requireAuth);

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

app.post('/api/auth/logout', function (_req, res) {
  return res.clearCookie('auth_token').json({ ok: true });
});

app.listen(port, function () {
  console.log('API listening on http://localhost:' + port);
});
