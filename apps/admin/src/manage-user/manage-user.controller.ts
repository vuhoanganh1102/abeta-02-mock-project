import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ManageUserService } from './manage-user.service';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import { SendgridService } from '@app/sendgrid';
import {FileInterceptor} from "@nestjs/platform-express";

@ApiBearerAuth()
@ApiTags('Manage user')
@Controller('manage-user')
export class ManageUserController {
  constructor(
    private readonly manageUserService: ManageUserService,
    private readonly sendgrid: SendgridService,
  ) {}

  @Get('users')
  @ApiOperation({
    summary: 'get all users',
  })
  async getUsers() {
    return this.manageUserService.getUsers();
  }

  @Get('detailUser/:id')
  @ApiOperation({
    summary: 'get a user detail using id',
    description: 'insert user id to see all details'
  })
  async getDetailUser(@Param('id') id: string) {
    return this.manageUserService.getDetailUser(parseInt(id));
  }

  @Patch('deleteUser/:id')
  @ApiOperation({
    summary: 'admin deletes a user',
    description: 'insert user id to delete'
  })
  async deletedUser(@Param('id') id: string) {
    return this.manageUserService.deleteUser(parseInt(id));
  }

  @Patch('updateUser/:id')
  @ApiOperation({
    summary: 'admin updates user information',
    description: 'insert user id and update fields to update'
  })
  async updateUser(@Param('id') id: string, @Body() updater: UpdateUserDto) {
    return this.manageUserService.updateUser(parseInt(id), updater);
  }

  @Post('upload-user-image/:id')
  @ApiOperation({
    summary: 'change user profile picture',
    description: 'Upload a new image to firebase cloud. Get the link from cloud and update profile picture'
  })
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

  @Post('create-user')
  @ApiOperation({
    summary: 'create new user by email and send verify link to that email',
    description: 'Insert new email and password to create'
  })
  async createUser(@Body() createDto: CreateUserDto) {
    return this.manageUserService.createUser(createDto);
  }
}
