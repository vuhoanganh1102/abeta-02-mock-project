import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('get-list')
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    example: 'quang',
    description: 'first name or last name',
  })
  getListEmployee(@Query('name') name: string) {
    return this.employeeService.getListEmployee(name);
  }

  @Get('get-one/:id')
  getOneEmployee(@Param('id') id: number) {
    return this.employeeService.getOneEmployee(id);
  }
}
