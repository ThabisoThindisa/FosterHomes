export default function handleGetRequests(app, pool, requireAuth, publicUser) {
  app.get('/api/health', async function (_req, res) {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true, database: 'connected' });
    } catch (error) {
      res.status(503).json({ ok: false, database: 'unavailable' });
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


  //------------Get the programs saved by the admin----------
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

  //------------Get the Saved sstories to display----------
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

 ////------------Get registered homes----------
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
 
  //----Display the users to the admin
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

  app.get('/api/getEnquiries', requireAuth, async function (req, res) {
    if (req.user.u_role !== 'admin') {
      return res.status(403).json({
        message: 'Only administrators can view user queries.'
      });
    }

    try {
      const [rows] = await pool.query(
        `SELECT enquiry_id, full_name, email, phone, subject, message, status, created_at
         FROM enquiries
         ORDER BY created_at DESC, enquiry_id DESC`
      );

      return res.json({ data: rows });
    } catch (error) {
      console.error('Failed to retrieve user queries:', error);
      return res.status(500).json({
        message: 'Failed to retrieve user queries.'
      });
    }
  });

    //------------Display All images----------------
  app.get('/api/getAllImages', async function (_req, res) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM gallery ORDER BY id DESC;'
      );

      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve Gallery information!' });
    }
  });

  //------------Get Social workers added----------
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
 


//--------------------Get and update applications----------

app.get('/api/getAdoptionApplications', async (req, res) => {
    try {
          const sql = `
            SELECT aa.application_id, sw_user.u_full_name AS social_worker_name,
              p.ad_name AS program_name, aa.application_date, aa.status, aa.notes
            FROM adoption_applications AS aa
            LEFT JOIN social_workers AS sw
              ON aa.social_worker_id = sw.social_worker_id
            LEFT JOIN users AS sw_user
              ON sw.user_id = sw_user.user_id
            LEFT JOIN adoption_programs AS p
              ON aa.program_id = p.program_id
            ORDER BY aa.application_date DESC
          `;

        const [applications] = await pool.query(sql);

        res.status(200).json({
            success: true,
            data: applications
        });

    } catch (error) {
        console.error('Error fetching adoption applications:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve adoption applications.'
        });
    }
});



  //------------Get Galery----------
  app.get('/api/getPictures', async function (_req, res) {
    try {
      const [columns] = await pool.query('SHOW COLUMNS FROM gallery');
      const columnNames = new Set(columns.map((column) => column.Field));
      const imageColumn = columnNames.has('image_url')
        ? 'image_url'
        : columnNames.has('image_data')
          ? 'image_data'
          : null;

      if (!imageColumn) {
        throw new Error('Gallery table does not contain an image column.');
      }

      const [rows] = await pool.query(
        `SELECT id AS gallery_id, ${imageColumn} AS image_value, image_type, alt_text
         FROM gallery
         ORDER BY id DESC`
      );

      const pictures = rows.map((picture) => {
        const { image_value, ...pictureData } = picture;

        if (imageColumn === 'image_url') {
          return { ...pictureData, image_url: String(image_value) };
        }

        const imageData = Buffer.isBuffer(image_value)
          ? image_value
          : Buffer.from(image_value);
        const storedPath = imageData.toString('utf8');
        const imageUrl = /^\/uploads\/|^https?:\/\//i.test(storedPath)
          ? storedPath
          : `data:${picture.image_type};base64,${imageData.toString('base64')}`;

        return { ...pictureData, image_url: imageUrl };
      });

      return res.json({ data: pictures });
    } catch (error) {
      console.error('Failed to retrieve pictures:', error);
      return res.status(500).json({
        message: 'Failed to retrieve pictures'
      });
    }
  });
}
