import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

interface UploadParams {
  userId: string;
  type: 'resumes' | 'previews' | 'pictures';
  buffer: Buffer;
  filename: string;
  contentType?: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private storage: Storage;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);
  private readonly environment: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
    this.environment = process.env.NODE_ENV || 'development';
  }

  async onModuleInit() {
    try {
      const [exists] = await this.storage.bucket(this.bucket).exists();
      if (!exists) {
        await this.storage.createBucket(this.bucket);
        this.logger.log(`Bucket ${this.bucket} created successfully.`);
      } else {
        this.logger.log(`Bucket ${this.bucket} already exists.`);
      }

      const origins = [
        `http://${process.env.VITE_HOST}:${process.env.VITE_PORT}`,
        `https://${process.env.VITE_HOST}:${process.env.VITE_PORT}`,
      ];

      if (this.environment === 'development') {
        origins.push('http://localhost:5173');
        origins.push('http://localhost:3000');
      }

      // Set CORS configuration for the bucket
      await this.storage.bucket(this.bucket).setCorsConfiguration([
        {
          maxAgeSeconds: 3600,
          method: ['GET', 'HEAD', 'OPTIONS'],
          origin: [...origins],
          responseHeader: [
            'Content-Type',
            'Access-Control-Allow-Origin',
            'Content-Disposition',
          ],
        },
      ]);

      this.logger.log('Bucket CORS configuration updated successfully.');
    } catch (error) {
      this.logger.error('Error configuring bucket:', error);
      throw error;
    }
  }

  async uploadObject({
    userId,
    type,
    buffer,
    filename,
    contentType,
  }: UploadParams): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const filePath = `${this.environment}/${userId}/${type}/${filename}`;
      const file = bucket.file(filePath);

      await file.save(buffer, {
        metadata: {
          contentType: contentType || this.getContentType(filename),
        },
      });

      // Generate a signed URL with CORS headers
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        responseDisposition: 'attachment',
        responseType: contentType || this.getContentType(filename),
      });

      this.logger.debug(`File uploaded successfully, signed URL generated`);

      return signedUrl;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    try {
      const file = this.storage.bucket(this.bucket).file(filePath);
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      return signedUrl;
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: 'pictures',
    userId: string,
  ): Promise<string> {
    return this.uploadObject({
      userId,
      type: folder,
      buffer: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype,
    });
  }

  private getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  async deleteObject(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const fileName = fileUrl.split(`${this.bucket}/`)[1];
      if (!fileName) return;

      const file = this.storage.bucket(this.bucket).file(fileName);
      await file.delete();
      this.logger.debug(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }
}
