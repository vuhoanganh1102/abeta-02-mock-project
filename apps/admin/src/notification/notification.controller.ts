import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dtos/createNotification.dto';
import { Public } from '@app/core/decorators/public.decorator';
import {AuthAdmin} from "@app/core/decorators/authAdmin.decorator";
import {OnesignalService} from "@app/onesignal";


class tech {
  @ApiProperty({ example: '[]' })
  array: any;
  @ApiProperty({ example: 'Check title' })
  title: string;
  @ApiProperty({ example: 'la la la.' })
  content: string;
}
@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private readonly onesignalService: OnesignalService,
  ) {}

  @Post('create')
  createNewNotification(
    @AuthAdmin() admin,
    @Body() createDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNewNotification(admin.id, createDto);
  }

  @Public()
  @Get('get-one/:id')
  getOneNotification(@Param('id') id: number) {
    return this.notificationService.getOneNotification(id);
  }

  @Get('get-list')
  getListNotification(
      @Query('pageIndex') pageIndex: number,
      @Query('pageSize') pageSize: number,
  ) {
    return this.notificationService.getListNotification(pageIndex, pageSize);
  }

  @Patch('update/:id')
  updateNotification(
    @Param('id') id: number,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return this.notificationService.updateNotification(id, updateDto);
  }

  @Patch('delete/:id')
  deleteNotification(@Param('id') id: number) {
    return this.notificationService.deleteNotification(id);
  }
  @Post('/testPush')
  async pushNotification(@Body() body: tech) {
    return this.onesignalService.pushNotification(body.array, body.title, body.content);
  }

}
