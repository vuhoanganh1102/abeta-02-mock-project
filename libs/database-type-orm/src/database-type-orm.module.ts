import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './data-source';
import { DatabaseTypeOrmService } from './database-type-orm.service';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  providers: [DatabaseTypeOrmService],
  exports: [DatabaseTypeOrmService],
})
export class DatabaseTypeOrmModule {}
