import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurableModuleClass } from './jwt-authentication.module-definition';
import { JwtAuthenticationService } from './jwt-authentication.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from '@app/core/guards/user.guard';
import { AdminGuard } from '@app/core/guards/admin.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
@Global()
@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  providers: [JwtAuthenticationService],
  exports: [JwtAuthenticationService],
})
export class JwtAuthenticationModule extends ConfigurableModuleClass {}
