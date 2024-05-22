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
}
