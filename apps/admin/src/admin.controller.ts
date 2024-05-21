import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
// import { CreateAdminDto } from './dto/create-admin.dto';
// import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@app/jwt-authentication/admin.guard';
import { SignInDto } from './dto/signIn.dto';
import { AuthAdmin } from '@app/jwt-authentication/admin.decorator';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
// import { LiteralObject } from '@nestjs/common/cache';
import { UpdateUserDto } from './dto/updateUser.entity';

// import { JwtAuthenticationGuard } from '@app/jwt-authentication';
class Ref {
  @ApiProperty({ example: '{"refresh_token":}' })
  refresh_token: string;
}
@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
  @Public()
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    // @Response() res,
    @AuthAdmin() admin,
  ) {
    console.log(admin);
    return this.adminService.signInAdmin(signInDto);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('detailUser/:id')
  async getDetailUser(@Param('id') id: string) {
    return this.adminService.getDetailUser(parseInt(id));
  }

  @Patch('deleteUser/:id')
  async deletedUser(@Param('id') id: string) {
    return this.adminService.deleteUser(parseInt(id));
  }

  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updater: UpdateUserDto) {
    return this.adminService.updateUser(parseInt(id), updater);
  }

  @Public()
  @Post('newToken')
  async resetAccessToken(@Body() obj: Ref) {
    return this.adminService.getNewAccessToken(obj.refresh_token);
    // console.log(obj.refresh_token);
  }
}
