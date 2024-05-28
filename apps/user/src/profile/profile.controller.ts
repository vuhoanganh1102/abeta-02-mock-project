import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthUser } from '@app/core/decorators/authUser.decorator';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('get-profile')
  @ApiOperation({
    summary: 'Get profile of user logging in',
  })
  getProfile(@AuthUser() user) {
    return this.profileService.getProfile(user);
  }

  @Patch('update-profile')
  @ApiOperation({
    summary: 'User update personal information',
    description: 'Insert parts or all information to update the profile',
  })
  updateProfile(@AuthUser() user, @Body() updateDto: UpdateProfileDto) {
    return this.profileService.updateProfile(user.id, updateDto);
  }

  @Post('upload-single-image')
  @ApiOperation({
    summary: 'Change profile picture',
    description:
      'Upload a new image to firebase cloud. Get the link from cloud and update profile picture',
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
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() { id },
  ) {
    return this.profileService.uploadAvatar(file, id);
  }
}
