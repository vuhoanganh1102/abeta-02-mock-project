import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurableModuleClass } from './jwt-authentication.module-definition';
import { JwtAuthenticationService } from './jwt-authentication.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';
@Global()
@Module({
  imports: [JwtModule],
  providers: [
    JwtAuthenticationService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
  exports: [JwtAuthenticationService],
})
export class JwtAuthenticationModule extends ConfigurableModuleClass {}
