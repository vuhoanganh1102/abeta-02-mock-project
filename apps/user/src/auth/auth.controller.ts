import { Public } from '@app/core/decorators/public.decorator';
import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { LoginAuthDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@app/core/decorators/authUser.decorator';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { refreshTokenDto } from './dtos/refreshToken.dto';

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
  refreshToken(@Body() { refreshToken }: refreshTokenDto) {
    return this.authService.refreshTokens(refreshToken);
  }
}
