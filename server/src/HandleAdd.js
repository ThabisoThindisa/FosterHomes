import fs from 'node:fs/promises';
import upload from './FileUploading.js';

const childStatuses = [
  'in_care',
  'eligible_for_adoption',
  'matched',
  'adopted',
  'reunified'
];

const applicationStatuses = [
  'submitted',
  'under_review',
  'assessment',
  'approved',
  'matched',
  'completed',
  'rejected',
  'withdrawn'
];

export default function HandleAdd(app, pool, requireAuth) {
  app.post('/api/AddPrograms', async (req, res) => {
    const { ad_name, ad_description, ad_eligibility_requirements } = req.body;
    const programName = typeof ad_name === 'string' ? ad_name.trim() : '';
    const description = typeof ad_description === 'string' ? ad_description.trim() : '';
    const eligibility = typeof ad_eligibility_requirements === 'string'
      ? ad_eligibility_requirements.trim() || null
      : null;

    if (!programName || !description) {
      return res.status(400).json({
        message: 'Program name and description are required.'
      });
    }

    try {
      const [result] = await pool.query(
        'INSERT INTO adoption_programs (ad_name, ad_description, ad_eligibility_requirements) VALUES (?, ?, ?)',
        [programName, description, eligibility]
      );

      return res.status(201).json({
        program_id: result.insertId,
        ad_name: programName,
        ad_description: description,
        ad_eligibility_requirements: eligibility,
        ad_is_active: 1
      });
    } catch (error) {
      console.error('Error inserting program:', error);
      return res.status(500).json({ message: 'Error inserting program' });
    }
  });

  app.post('/api/AddStory', async (req, res) => {
    const { title, content, author_id, published_at, is_published } = req.body;

    if (
      typeof title !== 'string' || !title.trim() ||
      typeof content !== 'string' || !content.trim()
    ) {
      return res.status(400).json({
        message: 'Title and content are required.'
      });
    }

    try {
      const [result] = await pool.execute(
        `INSERT INTO ourstories
          (title, content, author_id, published_at, is_published)
         VALUES (?, ?, ?, ?, ?)`,
        [
          title.trim(),
          content.trim(),
          author_id || null,
          published_at || new Date(),
          is_published ?? 1
        ]
      );

      const [stories] = await pool.execute(
        'SELECT * FROM ourstories WHERE Story_id = ?',
        [result.insertId]
      );

      return res.status(201).json(stories[0]);
    } catch (error) {
      console.error('Error adding story:', error);
      return res.status(500).json({ message: 'Unable to add story.' });
    }
  });

  app.post('/api/AddWorker', async (req, res) => {
    const {
      user_id,
      s_fullName,
      s_registration_number,
      s_organisation_name,
      s_office_location,
      s_specialisation
    } = req.body;
    const fullName = typeof s_fullName === 'string' ? s_fullName.trim() : '';
    const registrationNumber = typeof s_registration_number === 'string'
      ? s_registration_number.trim()
      : '';

    if (
      !fullName || !registrationNumber ||
      !s_organisation_name || !s_office_location || !s_specialisation
    ) {
      return res.status(400).json({
        message: 'Please fill all information.'
      });
    }

    try {
      let workerUserId = Number(user_id);
      if (!Number.isInteger(workerUserId) || workerUserId <= 0) {
        const [users] = await pool.execute(
          `SELECT user_id
           FROM users
           WHERE u_full_name = ? AND u_role = 'social_worker' AND u_is_active = 1
           LIMIT 2`,
          [fullName]
        );

        if (users.length === 0) {
          return res.status(404).json({
            message: 'Create or select an active social worker account before adding worker details.'
          });
        }
        if (users.length > 1) {
          return res.status(409).json({
            message: 'More than one social worker account has this name. Provide the user ID.'
          });
        }

        workerUserId = users[0].user_id;
      }

      const [users] = await pool.execute(
        `SELECT user_id, u_full_name
         FROM users
         WHERE user_id = ? AND u_role = 'social_worker' AND u_is_active = 1`,
        [workerUserId]
      );

      if (!users[0]) {
        return res.status(404).json({
          message: 'Active social worker account not found.'
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO social_workers
          (user_id, s_registration_number, s_organisation_name, s_office_location, s_specialisation)
         VALUES (?, ?, ?, ?, ?)`,
        [
          workerUserId,
          registrationNumber,
          s_organisation_name,
          s_office_location,
          s_specialisation
        ]
      );

      return res.status(201).json({
        social_worker_id: result.insertId,
        user_id: workerUserId,
        worker_name: users[0].u_full_name,
        s_registration_number: registrationNumber,
        s_organisation_name,
        s_office_location,
        s_specialisation
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'A social worker with this registration number already exists.'
        });
      }

      console.error('Error adding social worker:', error);
      return res.status(500).json({ message: 'Could not add the social worker.' });
    }
  });

  app.post('/api/AddPictures', upload.single('image'), async (req, res) => {
    const altText = typeof req.body.alt_text === 'string' ? req.body.alt_text.trim() : '';

    if (!req.file || !altText) {
      if (req.file) await fs.unlink(req.file.path).catch((error) => {
        console.error('Could not remove an incomplete gallery upload:', error);
      });
      return res.status(400).json({ message: 'Image and description are required.' });
    }
    if (altText.length > 150) {
      await fs.unlink(req.file.path).catch((error) => {
        console.error('Could not remove an invalid gallery upload:', error);
      });
      return res.status(400).json({
        message: 'Image description must be 150 characters or fewer.'
      });
    }

    const imageUrl = '/uploads/' + req.file.filename;

    try {
      const [columns] = await pool.query('SHOW COLUMNS FROM gallery');
      const columnNames = new Set(columns.map((column) => column.Field));
      const imageColumn = columnNames.has('image_url')
        ? 'image_url'
        : columnNames.has('image_data')
          ? 'image_data'
          : null;

      if (!imageColumn) {
        throw new Error('Gallery table does not contain a supported image column.');
      }

      const [result] = await pool.execute(
        `INSERT INTO gallery (image_type, ${imageColumn}, alt_text) VALUES (?, ?, ?)`,
        [
          req.file.mimetype,
          imageColumn === 'image_url' ? imageUrl : Buffer.from(imageUrl),
          altText
        ]
      );

      return res.status(201).json({
        gallery_id: result.insertId,
        image_url: imageUrl,
        alt_text: altText
      });
    } catch (error) {
      console.error('Could not save the gallery image:', error);
      await fs.unlink(req.file.path).catch((cleanupError) => {
        console.error('Could not remove a failed gallery upload:', cleanupError);
      });
      return res.status(500).json({ message: 'Could not save the gallery image.' });
    }
  });

  app.post('/api/AddChild', async (req, res) => {
    const {
      C_fullName,
      c_reference_code,
      c_date_of_birth,
      c_gender,
      status,
      special_needs
    } = req.body;

    if (
      typeof C_fullName !== 'string' || !C_fullName.trim() ||
      typeof c_reference_code !== 'string' || !c_reference_code.trim() ||
      typeof c_date_of_birth !== 'string' || !c_date_of_birth.trim() ||
      typeof c_gender !== 'string' || !c_gender.trim()
    ) {
      return res.status(400).json({
        message: 'Please provide all required child information.'
      });
    }

    const childStatus = typeof status === 'string' && status.trim()
      ? status.trim()
      : 'in_care';
    if (!childStatuses.includes(childStatus)) {
      return res.status(400).json({ message: 'Invalid child status.' });
    }

    const specialNeeds = typeof special_needs === 'string' ? special_needs.trim() : '';

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
          specialNeeds || null
        ]
      );

      return res.status(201).json({
        child_id: result.insertId,
        C_fullName: C_fullName.trim(),
        c_reference_code: c_reference_code.trim(),
        c_date_of_birth: c_date_of_birth.trim(),
        c_gender: c_gender.trim(),
        status: childStatus,
        special_needs: specialNeeds
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'That reference code is already in use.' });
      }

      console.error('Error inserting child:', error);
      return res.status(500).json({ message: 'Could not add the child.' });
    }
  });

  app.post('/api/AddEnquiry', async (req, res) => {
    const {
      enq_full_name,
      enq_email,
      enq_phone,
      enq_subject,
      enq_message,
      enq_status
    } = req.body;

    if (
      typeof enq_full_name !== 'string' || !enq_full_name.trim() ||
      typeof enq_email !== 'string' || !enq_email.trim() ||
      typeof enq_message !== 'string' || !enq_message.trim()
    ) {
      return res.status(400).json({
        message: 'Name, email and message are required.'
      });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO enquiries
          (full_name, email, phone, subject, message, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          enq_full_name.trim(),
          enq_email.trim(),
          enq_phone || null,
          enq_subject || null,
          enq_message.trim(),
          enq_status || 'new'
        ]
      );
      const [rows] = await pool.query(
        'SELECT * FROM enquiries WHERE enquiry_id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        message: 'Enquiry added successfully.',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error adding enquiry:', error);
      return res.status(500).json({
        message: 'Failed to add enquiry.',
        error: error.message
      });
    }
  });

  app.post('/api/updateAccount', requireAuth, async (req, res) => {
    const {
      s_marital_status,
      s_occupation,
      s_address,
      s_adoption_preferences
    } = req.body;

    if (
      !s_address || !s_marital_status
    ) {
      return res.status(400).json({
        message: 'Please enter all information.'
      });
    }

    try {
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
          s_occupation || null,
          s_address,
          s_adoption_preferences || null
        ]
      );
      const [rows] = await pool.query(
        `SELECT s_marital_status, s_occupation, s_address, s_adoption_preferences
         FROM applicants
         WHERE user_id = ?
         LIMIT 1`,
        [req.user.user_id]
      );

      return res.status(200).json({
        message: 'Account details updated successfully.',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error updating applicant information:', error);
      return res.status(500).json({
        message: 'Failed to update.',
        error: error.message
      });
    }
  });

  app.post('/api/makeAplication', requireAuth, async (req, res) => {
    try {
      const {
        social_worker_id,
        program_id,
        foster_home_id,
        application_date,
        notes
      } = req.body;
      const socialWorkerId = Number(social_worker_id);
      const programId = Number(program_id);
      const fosterHomeId = Number(foster_home_id);

      if (
        !Number.isInteger(socialWorkerId) || socialWorkerId <= 0 ||
        !Number.isInteger(programId) || programId <= 0 ||
        !Number.isInteger(fosterHomeId) || fosterHomeId <= 0 ||
        typeof application_date !== 'string' || !application_date.trim()
      ) {
        return res.status(400).json({
          message: 'Select a social worker, program, foster home, and application date.'
        });

        app.put('/api/updateApplicationStatus/:applicationId', requireAuth, async (req, res) => {
          if (req.user.u_role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can update application statuses.' });
          }

          const applicationId = Number(req.params.applicationId);
          const { status } = req.body;
          if (
            !Number.isInteger(applicationId) || applicationId <= 0 ||
            typeof status !== 'string' || !applicationStatuses.includes(status)
          ) {
            return res.status(400).json({ message: 'Provide a valid application ID and status.' });
          }

          try {
            const [result] = await pool.execute(
              'UPDATE adoption_applications SET status = ? WHERE application_id = ?',
              [status, applicationId]
            );
            if (result.affectedRows === 0) {
              const [applications] = await pool.execute(
                'SELECT application_id FROM adoption_applications WHERE application_id = ? LIMIT 1',
                [applicationId]
              );
              if (!applications[0]) {
                return res.status(404).json({ message: 'Application not found.' });
              }
            }

            return res.json({ message: 'Application status updated.', application_id: applicationId, status });
          } catch (error) {
            console.error('Error updating application status:', error);
            return res.status(500).json({ message: 'Failed to update application status.' });
          }
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

      const [result] = await pool.query(
        `INSERT INTO adoption_applications
          (applicant_id, social_worker_id, program_id, foster_home_id, application_date, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          applicants[0].applicant_id,
          socialWorkerId,
          programId,
          fosterHomeId,
          application_date.trim(),
          'submitted',
          notes || null
        ]
      );
      const [rows] = await pool.query(
        'SELECT * FROM adoption_applications WHERE application_id = ?',
        [result.insertId]
      );

      return res.status(201).json({
        message: 'Application made successfully.',
        data: rows[0]
      });
    } catch (error) {
      console.error('Error adding application:', error);
      return res.status(500).json({
        message: 'Failed to add application.',
        error: error.message
      });
    }
  });
}
