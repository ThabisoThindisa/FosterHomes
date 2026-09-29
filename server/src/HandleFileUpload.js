

import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/AddPictures', upload.single('image'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: 'Please select an image.'
            })
        }

        const { alt_text } = req.body

        const [result] = await pool.execute(
            `INSERT INTO gallery
             (image_data, image_type, alt_text)
             VALUES (?, ?, ?)`,
            [
                req.file.buffer,
                req.file.mimetype,
                alt_text
            ]
        )

        res.status(201).json({
            gallery_id: result.insertId,
            alt_text,
            image_type: req.file.mimetype
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to save image.'
        })
    }
})