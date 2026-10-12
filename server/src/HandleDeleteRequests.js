export default function HandleDeleteRequests(app, pool) {
  app.delete('/api/deleteProgram/:id', async (req, res) => {
    try {
      const program_ID = Number(req.params.id);

      if (!Number.isInteger(program_ID) || program_ID <= 0) {
        return res.status(400).json({
          message: 'Invalid program ID'
        });
      }

      const [result] = await pool.execute(
        'DELETE FROM adoption_programs WHERE program_id = ?',
        [program_ID]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Program not found'
        });
      }

      return res.status(200).json({
        message: 'Program deleted successfully',
        deletedId: program_ID
      });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          message: 'This program cannot be deleted because adoption applications reference it.'
        });
      }

      console.error('Error deleting program:', error);

      return res.status(500).json({
        message: 'Failed to delete program'
      });
    }
  });


   app.delete('/api/DeleteStory/:id', async (req, res) => {
    try {
      const Story_ID = Number(req.params.id);

      if (!Number.isInteger(Story_ID) || Story_ID <= 0) {
        return res.status(400).json({
          message: 'Invalid Story ID'
        });
      }

      const [result] = await pool.execute(
        'DELETE FROM ourstories WHERE Story_id = ?',
        [Story_ID]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Story not found'
        });
      }

      return res.status(200).json({
        message: 'Story deleted successfully',
        deletedId: Story_ID
      });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          message: 'This story cannot be deleted because another record references it.'
        });
      }

      console.error('Error deleting Story:', error);

      return res.status(500).json({
        message: 'Failed to delete Story'
      });
    }
  });

}
