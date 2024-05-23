import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './CreateAdmin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
