import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { AuthAdmin } from '@app/core/decorators/authAdmin.decorator';
// import { AuthAdmin } from '@app/core/decorators/authAdmin.decorator';

class RefreshToken {
  @ApiProperty({ example: '{"refresh_token":}' })
  refresh_token: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class sendLinkMail {
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  email: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class resetPassword {
  @ApiProperty({ example: '23456' })
  password: string;
}

class formChangePassword {
  @ApiProperty({ example: '23456' })
  oldPassword: string;
  @ApiProperty({ example: '23456' })
  newPassword: string;
}
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
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Public()
  @Post('newToken')
  @ApiOperation({
    summary: 'Get a new access token using refresh token',
    description: 'insert refresh token',
  })
  async resetAccessToken(@Body() refreshToken: RefreshToken) {
    return this.authService.getNewAccessToken(refreshToken.refresh_token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary:
      'Send an email contains a link to change the password without logging in',
    description:
      'Insert an email. A link contains a token will be created and send to that email',
  })
  async forgotPassword(@Body() sendLinkMail: sendLinkMail) {
    return this.authService.forgotPassword(sendLinkMail.email);
  }

  @Public()
  @Post('reset-password/:otp')
  @ApiOperation({
    summary: 'Reset password with the link received from email',
    description:
      'Take the link received from email contains a token to reset password',
  })
  async resetPassword(
    @Body() resetPassword: resetPassword,
    @Param('otp') otp: string,
  ) {
    return this.authService.resetPassword(resetPassword.password, otp);
  }

  @Public()
  @Get('reset-password-form/:otp')
  getResetPasswordOtp(@Param('otp') otp: string) {
    return {
      otp: otp,
    };
  }

  @Post('change-password')
  changePassword(@AuthAdmin() admin, @Body() body: formChangePassword) {
    return this.authService.changePassword(
      admin.id,
      body.newPassword,
      body.oldPassword,
    );
  }
}
