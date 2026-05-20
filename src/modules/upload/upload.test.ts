import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import uploadRouter from './upload.route';
import { storageService } from '../../shared/services/storage.service';
import { errorHandler } from '../../shared/middlewares/errorHandler';

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api/upload', uploadRouter);
app.use(errorHandler);

// Mock the storage service
vi.mock('../../shared/services/storage.service', () => ({
  storageService: {
    uploadFile: vi.fn(),
    getPresignedUrl: vi.fn().mockResolvedValue('https://mocked-url.com/file.jpg'),
  },
}));

describe('Upload API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload a valid image file and return a presigned URL', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('mock image data'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.url).toBe('https://mocked-url.com/file.jpg');
    expect(storageService.uploadFile).toHaveBeenCalledTimes(1);
    expect(storageService.getPresignedUrl).toHaveBeenCalledTimes(1);
  });

  it('should reject non-image files (e.g. PDF)', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('mock pdf data'), {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Invalid file type/);
    expect(storageService.uploadFile).not.toHaveBeenCalled();
  });

  it('should reject files larger than 5MB', async () => {
    // 6MB buffer
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');

    const response = await request(app)
      .post('/api/upload')
      .attach('file', largeBuffer, {
        filename: 'large.jpg',
        contentType: 'image/jpeg',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/File too large/); // multer default error message
    expect(storageService.uploadFile).not.toHaveBeenCalled();
  });
});
