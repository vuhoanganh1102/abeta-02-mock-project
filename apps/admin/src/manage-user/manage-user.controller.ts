import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  UseGuards, UseInterceptors, UploadedFile, Query,
} from '@nestjs/common';
import { ManageUserService } from './manage-user.service';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from '@nestjs/swagger';
import { AdminGuard } from '@app/core/guards/admin.guard';
// import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { SendgridService } from '@app/sendgrid';
import { Obj } from './dto/SendAgainMail.dto';
import { otp } from './dto/OtpCheck.entity';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthUser} from "@app/core/decorators/authUser.decorator";
import {AuthAdmin} from "@app/core/decorators/authAdmin.decorator";

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

  @Post('upload-user-image/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
      @Param('id') id: number,
      @UploadedFile() file: Express.Multer.File,
  ) {
    return this.manageUserService.uploadAvatar(file, id);
  }

  // api gui lai opt email de xac nhan tao tai khoan cho nguoi dung khi email
  // @Public()
  @Post('sendmailagain')
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


}
