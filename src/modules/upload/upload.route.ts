import { Router } from 'express';
import { uploadFile } from './upload.controller';
import { uploadMiddleware } from '../../shared/middlewares/upload.middleware';

const router = Router();

router.post('/', uploadMiddleware.single('file'), uploadFile);

export default router;
