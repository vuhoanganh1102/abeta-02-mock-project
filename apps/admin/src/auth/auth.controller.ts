import {
  Body,
  Controller,
  // Get,
  // Param,
  // Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { LoginDto } from './dtos/Login.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminGuard } from '@app/jwt-authentication/admin.guard';

class Ref {
  @ApiProperty({ example: '{"refresh_token":}' })
  refresh_token: string;
}
@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
@UseGuards(AdminGuard)
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
}
