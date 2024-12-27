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
  private privateBucket: string;
  private publicBucket: string;
  private readonly logger = new Logger(StorageService.name);
  private readonly environment: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    this.privateBucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
    this.publicBucket = process.env.GOOGLE_CLOUD_PUBLIC_BUCKET_NAME;
    this.environment = process.env.NODE_ENV || 'development';
  }

  async onModuleInit() {
    try {
      await this.initializeBucket(this.privateBucket);
      await this.initializeBucket(this.publicBucket, true);
    } catch (error) {
      this.logger.error('Error configuring buckets:', error);
      throw error;
    }
  }

  private async initializeBucket(bucketName: string, isPublic = false) {
    const [exists] = await this.storage.bucket(bucketName).exists();

    if (!exists) {
      await this.storage.createBucket(bucketName, {
        location: 'EU',
      });

      if (isPublic) {
        const bucket = this.storage.bucket(bucketName);
        const [policy] = await bucket.iam.getPolicy({
          requestedPolicyVersion: 3,
        });

        policy.version = 3;

        policy.bindings.push({
          role: 'roles/storage.objectViewer',
          members: ['allUsers'],
        });

        await this.storage.bucket(bucketName).iam.setPolicy(policy);
      }

      const origins = [
        `http://${process.env.VITE_HOST}:${process.env.VITE_PORT}`,
        `https://${process.env.VITE_HOST}:${process.env.VITE_PORT}`,
      ];

      if (this.environment === 'development') {
        origins.push('http://localhost:5173');
        origins.push('http://localhost:3000');
      }

      await this.storage.bucket(bucketName).setCorsConfiguration([
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

      this.logger.log(
        `Bucket ${bucketName} created and configured successfully.`,
      );
    } else {
      this.logger.log(`Bucket ${bucketName} already exists.`);
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
      const bucket = this.storage.bucket(this.privateBucket);
      const filePath = `${userId}/${type}/${filename}`;
      const file = bucket.file(filePath);

      this.logger.log('Uploading file to storage:', {
        userId,
        type,
        filename,
        contentType,
      });

      await file.save(buffer, {
        metadata: {
          contentType: contentType || this.getContentType(filename),
        },
      });

      this.logger.log('File uploaded successfully:', {
        userId,
        type,
        filename,
        contentType,
      });

      // Generate a signed URL with CORS headers
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        responseDisposition: 'attachment',
        responseType: contentType || this.getContentType(filename),
      });

      this.logger.log('Signed URL generated:', {
        userId,
        type,
        filename,
        contentType,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    try {
      const file = this.storage.bucket(this.privateBucket).file(filePath);
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
    resumeId: string,
  ): Promise<string> {
    const bucket = this.storage.bucket(this.publicBucket);
    const extension = file.originalname.split('.').pop();
    const filePath = `${userId}/${folder}/resume-${resumeId}.${extension}`;
    const fileObject = bucket.file(filePath);

    try {
      this.logger.log('Uploading image to public bucket:', {
        userId,
        folder,
        resumeId,
      });
      await fileObject.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      this.logger.log('Image uploaded successfully:', {
        userId,
        folder,
        resumeId,
      });

      return `https://storage.googleapis.com/${this.publicBucket}/${filePath}`;
    } catch (error) {
      this.logger.error('Error uploading image:', error);
      throw error;
    }
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
      const fileName = fileUrl.split(`${this.privateBucket}/`)[1];
      if (!fileName) return;

      const file = this.storage.bucket(this.privateBucket).file(fileName);
      await file.delete();
      this.logger.debug(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }
}
