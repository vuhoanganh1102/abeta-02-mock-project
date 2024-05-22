import { PartialType } from '@nestjs/swagger';
import { CreateManageUserDto } from './create-manage-user.dto';

export class UpdateManageUserDto extends PartialType(CreateManageUserDto) {}
