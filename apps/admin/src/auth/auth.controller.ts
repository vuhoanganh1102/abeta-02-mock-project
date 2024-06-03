import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthAdmin } from '@app/core/decorators/authAdmin.decorator';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { ForgotPasswordDto } from './dtos/forgotPasswordDto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { TokenDto } from './dtos/token.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'login for admin',
    description: 'insert email and password to login',
  })
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Get a new access token using refresh token',
    description: 'insert refresh token',
  })
  async refreshToken(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary:
      'Send an email contains a link to change the password without logging in',
    description:
      'Insert an email. A link contains a token will be created and send to that email',
  })
  async forgotPassword(@Body() forgotDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotDto.email);
  }

  @Public()
  @Post('reset-password/:otp')
  @ApiOperation({
    summary: 'Reset password with the link received from email',
    description: 'Insert new password',
  })
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
    @Query() tokenDto: TokenDto,
  ) {
    return this.authService.resetPassword(resetDto.password, tokenDto.token);
  }

  @Public()
  @Get('reset-password-form')
  @ApiOperation({
    summary: 'A GET API for transferring token to reset password interface',
    description:
      'Take the link received from email contains a token to reset password',
  })
  getResetPasswordToken(@Query() tokenDto: TokenDto) {
    return {
      token: tokenDto.token,
    };
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Admin logged in changes the password',
    description: 'Insert old password to verify and new password to change',
  })
  changePassword(@AuthAdmin() admin, @Body() changeDto: ChangePasswordDto) {
    return this.authService.changePassword(admin.id, changeDto);
  }
}
