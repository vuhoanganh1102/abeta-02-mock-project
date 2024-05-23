import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthAdmin } from '@app/jwt-authentication/admin.decorator';
import { UpdateUserDto } from './dtos/updateUser.entity';
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
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @Get('detailUser/:id')
  async getDetailUser(@Param('id') id: string) {
    return this.authService.getDetailUser(parseInt(id));
  }

  @Patch('deleteUser/:id')
  async deletedUser(@Param('id') id: string) {
    return this.authService.deleteUser(parseInt(id));
  }

  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updater: UpdateUserDto) {
    return this.authService.updateUser(parseInt(id), updater);
  }

  @Public()
  @Post('newToken')
  async resetAccessToken(@Body() obj: Ref) {
    return this.authService.getNewAccessToken(obj.refresh_token);
    // console.log(obj.refresh_token);
  }
}
