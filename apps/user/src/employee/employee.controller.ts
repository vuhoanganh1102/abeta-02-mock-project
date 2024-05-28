import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Search list of employees by name',
    description: "Insert name. API will find employees who have either first name or last name matches with the input"
  })
  getListEmployee(@Query('name') name: string) {
    return this.employeeService.getListEmployee(name);
  }

  @ApiOperation({
    summary: "Get an employee's profile",
    description: "Insert employee id to get his/her profile"
  })
  @Get('get-one/:id')
  getOneEmployee(@Param('id') id: number) {
    return this.employeeService.getOneEmployee(id);
  }
}
