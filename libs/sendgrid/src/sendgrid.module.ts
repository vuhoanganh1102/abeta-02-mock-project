import { Global, Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { ConfigurableModuleClass } from '@app/sendgrid/sendgrid.module-definition';
@Global()
@Module({
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule extends ConfigurableModuleClass {}
