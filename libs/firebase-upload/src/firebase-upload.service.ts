import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseUploadService {
  private readonly storage: firebase.storage.Storage;
  constructor() {
    const serviceAccount = require('./serviceAccountKey.json');
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    this.storage = firebase.storage();
  }

  getStorageInstance(): firebase.storage.Storage {
    return this.storage;
  }

  async uploadSingleImage(file) {
    const storage = this.getStorageInstance();
    const bucket = storage.bucket();
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimeType,
      },
    });
    new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve(imageUrl);
      });
      stream.end(file.buffer);
    });
    return imageUrl;
  }
}
