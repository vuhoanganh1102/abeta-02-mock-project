import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ManageUserService } from './manage-user.service';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@app/jwt-authentication/admin.guard';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { SendgridService } from '@app/sendgrid';

class Obj {
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  receiver: string;
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  subject: string;
  @ApiProperty({ example: 'verify' })
  templateName: string;
}
class otp {
  @ApiProperty({ example: 'accofcod1102@gmail.com' })
  email: string;
  @ApiProperty({ example: 'otp' })
  otp: string;
}
@ApiBearerAuth()
@ApiTags('Manage user')
@UseGuards(AdminGuard)
@Controller('manage-user')
export class ManageUserController {
  constructor(
    private readonly manageUserService: ManageUserService,
    private readonly sendgrid: SendgridService,
  ) {}

  @Get('users')
  async getUsers() {
    return this.manageUserService.getUsers();
  }

  @Get('detailUser/:id')
  async getDetailUser(@Param('id') id: string) {
    return this.manageUserService.getDetailUser(parseInt(id));
  }

  @Patch('deleteUser/:id')
  async deletedUser(@Param('id') id: string) {
    return this.manageUserService.deleteUser(parseInt(id));
  }

  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updater: UpdateUserDto) {
    return this.manageUserService.updateUser(parseInt(id), updater);
  }

  @Public()
  @Post('sendmail')
  async sendEmail(@Body() body: Obj) {
    return this.sendgrid.sendMail(
      body.receiver,
      body.subject,
      body.templateName,
    );
  }

  @Public()
  @Post('createuser')
  async createUser(@Body() body: CreateUserDto) {
    return this.manageUserService.createUser(body);
  }

  // @Public()
  // async userSendEmail(@Body() body:){

  // }
  @Public()
  @Post('verifyEmailOtp')
  async verifyEmailOtp(@Body() body: otp) {
    return this.manageUserService.doneVerifyOtpEmail(body.email, body.otp, 1);
  }
}
