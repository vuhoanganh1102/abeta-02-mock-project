import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { AuthUser } from '@app/core/decorators/authUser.decorator';

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('all')
  @ApiOperation({
    description:
      'return all data and count all notification. isRead status can be chosen in 3 situation',
    summary: 'find all notifications with isRead status',
  })
  @ApiQuery({
    name: 'isRead',
    type: Number,
    required: true,
    example: '1',
    description: '1: read, 0: unread, 2: choose both',
  })
  findAll(
    @AuthUser() { id },
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('isRead') isRead: number,
  ) {
    return this.notificationService.findAll(id, pageIndex, pageSize, isRead);
  }

  @ApiOperation({
    description: 'insert notification id to delete it',
    summary: 'delete a notification only on user side',
  })
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.notificationService.delete(id);
  }

  @ApiOperation({
    summary: 'mark a notification as read',
    description:
      'insert notification id to change its status from unread to read',
  })
  @Patch('read-one/:id')
  async readNotification(@Param('id') id: number) {
    return this.notificationService.updateReadStatus(id);
  }

  @ApiOperation({
    summary: 'mark all notifications as read',
    description: "change all notifications' status from unread to read",
  })
  @Patch('read-all')
  async readAllNotification(@AuthUser() { id }) {
    return this.notificationService.readAllNotification(id);
  }
}
