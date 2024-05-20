// import { GlobalCacheModule } from '@app/cache';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryConfigController } from './config.controller';
// import { LibraryConfigService } from './config.service';
import Config from './entities/Config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config]),
    // GlobalCacheModule
  ],
  // providers: [LibraryConfigService],
  // exports: [LibraryConfigService],
  controllers: [LibraryConfigController],
})
export class LibraryConfigModule {}
