import { Module } from '@nestjs/common';
import { FirebaseUploadService } from './firebase-upload.service';

@Module({
  providers: [FirebaseUploadService],
  exports: [FirebaseUploadService],
})
export class FirebaseUploadModule {}
