import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiTags} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Public } from '@app/core/decorators/public.decorator';
import {AuthAdmin} from "@app/core/decorators/authAdmin.decorator";
import {AuthUser} from "@app/core/decorators/authUser.decorator";
import {User} from "@app/database-type-orm/entities/User.entity";

@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Post('all')
    findAll(
        @AuthUser() { id },
        @Query('pageIndex') pageIndex: number,
        @Query('pageSize') pageSize: number,
        ) {
        return this.notificationService.findAll(id, pageIndex, pageSize);
    }

    @ApiBody({ schema: { type: 'object', properties: {} } })
    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() updateData: Partial<User>) {
        return this.notificationService.update(id, updateData);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        return this.notificationService.delete(id);
    }

    @Patch('read-one/:id')
    async readNotification(@Param('id') id: number) {
        return this.notificationService.updateReadStatus(id);
    }

    @Patch('read-all')
    async readAllNotification(@AuthUser() { id }) {
        return this.notificationService.readAllNotification(id);
    }
}
