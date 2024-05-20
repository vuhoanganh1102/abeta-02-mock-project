import { ConfigurableModuleBuilder } from '@nestjs/common';
import { JwtAuthenticationModuleOptions } from './jwt-authentication.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<JwtAuthenticationModuleOptions>().build();
