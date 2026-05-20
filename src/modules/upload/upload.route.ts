import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from './upload.controller';
import { BadRequestError } from '../../shared/utils/errors';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Invalid file type. Only JPG, PNG, and WEBP are allowed'));
    }
  },
});

router.post('/', upload.single('file'), uploadFile);

export default router;
