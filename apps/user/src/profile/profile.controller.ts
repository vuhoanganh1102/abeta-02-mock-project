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
import { AuthUser } from '@app/core/decorators/user.decorator';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('get-profile')
  getProfile(@AuthUser() user) {
    return this.profileService.getProfile(user);
  }

  @Patch('update-profile')
  updateProfile(@AuthUser() user, @Body() updateDto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, updateDto);
  }

  @Post('upload-single-image')
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
    const imageUrl = await this.profileService.uploadAvatar(file, id);
    return {
      url: imageUrl,
    };
  }
}
