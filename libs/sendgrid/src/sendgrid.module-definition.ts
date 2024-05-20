import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SendGridModuleOptions } from '@app/sendgrid/sendgrid.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SendGridModuleOptions>().build();
