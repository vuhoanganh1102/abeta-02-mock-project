import { Public } from '@app/core/decorators/public.decorator';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { LoginAuthDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@app/core/decorators/authUser.decorator';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { refreshTokenDto } from './dtos/refreshToken.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'login for user',
    description: 'insert email and password to login',
  })
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Verify this account',
    description:
      'Take the link received from email contains a token to verify account',
  })
  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @ApiOperation({
    summary: 'Send an email contains a link to verify this account',
    description:
      'Create a link contains a token and send to this user through email',
  })
  @Post('send_email_verify')
  async sendEmailVerify(@AuthUser() { id }) {
    return this.authService.sendEmailVerify(id);
  }

  @ApiOperation({
    summary: 'Change password for a logged-in user',
    description: 'Insert old password and new password to change',
  })
  @Post('change-password')
  changePassword(@AuthUser() { id }, @Body() changeDto: ChangePasswordDto) {
    return this.authService.changePassword(id, changeDto);
  }

  @Public()
  @ApiOperation({
    summary:
      'Send an email contains a link to change the password without logging in',
    description:
      'Insert an email. A link contains a token will be created and send to that email',
  })
  @Post('forget-password')
  forgetPassword(@Body() forgetDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Reset password with the link received from email',
    description:
      'Take the link received from email contains a token to reset password',
  })
  @Post('reset-password')
  resetPassword(
    @Query('resetToken') resetToken: string,
    @Body() resetDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetToken, resetDto);
  }

  @Put('refresh')
  @ApiOperation({
    summary: 'Get new tokens for authentication',
    description: 'Insert refresh token to get new access token',
  })
  refreshToken(@Body() { refreshToken }: refreshTokenDto) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @Get('reset-password-form/:otp')
  getResetPasswordOtp(@Param('otp') otp: string) {
    return {
      otp: otp,
    };
  }
}
