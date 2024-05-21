import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './forgotPassword.dto';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('forgot')
  forgotPassword(@Body() forgotDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotDto);
  }
}
