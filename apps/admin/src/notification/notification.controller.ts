import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiProperty, ApiTags} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dtos/createNotification.dto';
import { Public } from '@app/core/decorators/public.decorator';
import {AuthAdmin} from "@app/core/decorators/authAdmin.decorator";

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: 'Admin create a new pending notification',
    description: 'Insert title, content, receiver id and due time for the notification'
  })
  createNewNotification(
    @AuthAdmin() admin,
    @Body() createDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNewNotification(admin.id, createDto);
  }

  @Public()
  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Get detail of a notification',
    description: 'Insert id to get detail'
  })
  getOneNotification(@Param('id') id: number) {
    return this.notificationService.getOneNotification(id);
  }

  @Get('get-list')
  @ApiOperation({
    summary: 'Get list of notifications',
  })
  getListNotification(
      @Query('pageIndex') pageIndex: number,
      @Query('pageSize') pageSize: number,
  ) {
    return this.notificationService.getListNotification(pageIndex, pageSize);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'update details of a notification',
  })
  updateNotification(
    @Param('id') id: number,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return this.notificationService.updateNotification(id, updateDto);
  }

  @Patch('delete/:id')
  @ApiOperation({
    summary: 'delete a notification',
  })
  deleteNotification(@Param('id') id: number) {
    return this.notificationService.deleteNotification(id);
  }

}
