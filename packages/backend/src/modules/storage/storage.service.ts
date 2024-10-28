import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    this.bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: 'profile' | 'preview',
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => reject(error));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    const fileName = imageUrl.split(`${this.bucket}/`)[1];
    if (!fileName) return;

    const file = this.storage.bucket(this.bucket).file(fileName);
    try {
      await file.delete();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
