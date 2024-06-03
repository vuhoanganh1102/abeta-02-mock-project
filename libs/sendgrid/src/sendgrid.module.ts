import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { ConfigurableModuleClass } from '@app/sendgrid/sendgrid.module-definition';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import {QueueModule} from "@app/queue";

@Module({
  imports: [
      TypeOrmModule.forFeature([EmailOtp]),
      QueueModule
  ],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule extends ConfigurableModuleClass {}
