import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurableModuleClass } from './jwt-authentication.module-definition';
import { JwtAuthenticationService } from './jwt-authentication.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';
import { AdminGuard } from './admin.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
@Global()
@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  providers: [
    JwtAuthenticationService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
  exports: [JwtAuthenticationService],
})
export class JwtAuthenticationModule extends ConfigurableModuleClass {}
