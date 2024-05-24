import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import {AuthAdmin} from "@app/core/decorators/authAdmin.decorator";

class Ref {
  @ApiProperty({ example: '{"refresh_token":}' })
  refresh_token: string;
}
class sendLinkMail {
  @ApiProperty({ example: 'accofcod1102@gmail.com' })
  email: string;
}

class resetPassword {
  @ApiProperty({ example: '23456' })
  password: string;
}
@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Public()
  @Post('newToken')
  async resetAccessToken(@Body() obj: Ref) {
    return this.authService.getNewAccessToken(obj.refresh_token);
    // console.log(obj.refresh_token);
  }

  @Public()
  @Post('forgot-password-form')
  async sendLinkMail(@Body() body: sendLinkMail) {
    return this.authService.sendMailToRessetPassword(body.email);
  }

  @Get('reset-password-form/:id')
  async viewToken(@Param('id') id: string) {
    return { id };
  }
  @Post('reset-password/:id')
  async resetPassword(
    @Body() body: resetPassword,
    @Param('id') id: string,
    @AuthAdmin() admin,
  ) {
    return this.authService.resetPassword(
      body.password,
      id,
      admin.email,
      admin.id,
    );
  }
}
