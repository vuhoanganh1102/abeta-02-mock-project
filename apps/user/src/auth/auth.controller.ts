import { Public } from '@app/core/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { LoginAuthDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@app/core/decorators/user.decorator';
import { Request } from 'express';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  changePassword(@AuthUser() { id }, @Body() changeDto: ChangePasswordDto) {
    return this.authService.changePassword(id, changeDto);
  }

  @Public()
  @Post('forget-password')
  forgetPassword(@Body() forgetDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetDto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(
    @Query('resetToken') resetToken: string,
    @Body() resetDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetToken, resetDto);
  }

  @Put('refresh')
  refreshToken(@Req() req: Request) {
    const refreshToken = req.headers.authorization
      .trim()
      .replace('Bearer ', '');
    return this.authService.refreshTokens(refreshToken);
  }
}
