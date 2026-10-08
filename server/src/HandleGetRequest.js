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
 
  //------------Retrieve the applicant id using user id----------
  app.get('/api/getApplicant', requireAuth, async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT applicant_id FROM applicants WHERE user_id = ?;',
        [req.user.user_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: 'Applicant not found.'
        });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error retrieving applicant:', error);

      res.status(500).json({
        message: 'Failed to retrieve applicant.',
        error: error.message
      });
    }
  });

  //------------Get Galery----------
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
}
