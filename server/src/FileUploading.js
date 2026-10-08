import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

export const uploadDir = path.resolve('uploads');

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

export default upload;