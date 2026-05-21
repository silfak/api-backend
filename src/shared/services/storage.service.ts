import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';

class StorageService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: env.s3.region,
      endpoint: env.s3.endpoint || undefined,
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
      // When using MinIO or R2, forcePathStyle might be needed
      forcePathStyle: true,
    });
  }

  /**
   * Upload a file to Object Storage
   * @param fileBuffer The file buffer
   * @param fileName The unique file name (e.g. uuid-filename.jpg)
   * @param mimeType The file mime type
   */
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: env.s3.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.client.send(command);
  }

  /**
   * Generate a secure pre-signed URL for accessing a file
   * @param fileName The unique file name
   * @param expiresIn Expiration time in seconds (default 1 hour)
   * @returns Pre-signed URL string
   */
  async getPresignedUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.s3.bucketName,
      Key: fileName,
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }
}

export const storageService = new StorageService();

