import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import { ManageUserService } from './manage-user.service';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@app/core/guards/admin.guard';
// import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { SendgridService } from '@app/sendgrid';
import { Obj } from './dto/SendAgainMail.dto';
import { otp } from './dto/OtpCheck.entity';

@ApiBearerAuth()
@ApiTags('Manage user')
@UseGuards(AdminGuard)
@Controller('manage-user')
export class ManageUserController {
  constructor(
    private readonly manageUserService: ManageUserService,
    private readonly sendgrid: SendgridService,
  ) {}

  // admin lay tat ca user
  @Get('users')
  async getUsers() {
    return this.manageUserService.getUsers();
  }

  // admin xem chi tiet nhan vien
  @Get('detailUser/:id')
  async getDetailUser(@Param('id') id: string) {
    return this.manageUserService.getDetailUser(parseInt(id));
  }

  // admin xoa nhan vien
  @Patch('deleteUser/:id')
  async deletedUser(@Param('id') id: string) {
    return this.manageUserService.deleteUser(parseInt(id));
  }

  // admin sua thong tin nhan vien
  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updater: UpdateUserDto) {
    return this.manageUserService.updateUser(parseInt(id), updater);
  }

  // api gui lai opt email de xac nhan tao tai khoan cho nguoi dung khi email
  // @Public()
  @Post('re-send-email')
  async sendEmail(@Body() body: Obj) {
    return this.manageUserService.sendAgainEmail(
      body.receiver,
      body.subject,
      body.templateName,
    );
  }

  // api tao tai khoan cho nhan vien trong do cos guir email de xac nhan
  // @Public()
  @Post('createuser')
  async createUser(@Body() body: CreateUserDto) {
    return this.manageUserService.createUser(body);
  }

  // @Public()
  // async userSendEmail(@Body() body:){

  // }

  // api nguoi dung nhap otp de xac nhan
  // @Public()
  @Post('verifyEmailOtp')
  async verifyEmailOtp(@Body() body: otp) {
    return this.manageUserService.doneVerifyOtpEmail(body.email, body.otp, 1);
  }
}
