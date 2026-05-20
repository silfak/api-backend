import { Request, Response, NextFunction } from 'express';
import { storageService } from '../../shared/services/storage.service';
import { sendSuccess } from '../../shared/utils/response';
import { BadRequestError } from '../../shared/utils/errors';
import crypto from 'crypto';
import path from 'path';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new BadRequestError('No file uploaded or file is invalid');
    }

    const file = req.file;
    const ext = path.extname(file.originalname);
    const uniqueFileName = `${crypto.randomUUID()}${ext}`;

    await storageService.uploadFile(file.buffer, uniqueFileName, file.mimetype);
    
    // We generate a pre-signed URL to return
    const url = await storageService.getPresignedUrl(uniqueFileName);

    return sendSuccess(res, { url }, 'File uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};
