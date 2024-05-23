import { Global, Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { ConfigurableModuleClass } from '@app/sendgrid/sendgrid.module-definition';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailOtp])],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule extends ConfigurableModuleClass {}
