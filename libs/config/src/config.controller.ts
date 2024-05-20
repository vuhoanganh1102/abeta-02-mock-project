import { ErrorCode, Permissions } from '@app/core/constants/enum';
import { Exception } from '@app/core/exception';
// import { AdminGuard } from '@app/core/guards/admin.guard';
import { validate } from '@app/core/validate';
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { Public } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
// import { RequirePermissions } from 'y/authorization';
import {
  detailConfigExampleResponse,
  exampleResponse,
  getConfigInfoExampleResponse,
  updateConfigApiBody,
  updateConfigSchema,
} from './config.schema';
// import { LibraryConfigService } from './config.service';

@ApiTags('Config')
@Controller('cms/config')
// @UseGuards(AdminGuard)
export class LibraryConfigController {
  // constructor(private readonly configService: LibraryConfigService) {}
  // @Get('/init')
  // @Public()
  // @ApiResponse(getConfigInfoExampleResponse)
  // @ApiConsumes('application/json')
  // @ApiBearerAuth()
  // async getConfigInfo() {
  //   return await this.configService.getConfigInfo();
  // }
  //
  // @Get('/')
  // @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  // @ApiResponse(detailConfigExampleResponse)
  // @ApiConsumes('application/json')
  // @ApiBearerAuth()
  // async getList(@Query() query: any) {
  //   return await this.configService.getListConfig(query);
  // }
  //
  // @Get('/:key')
  // @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  // @ApiResponse(detailConfigExampleResponse)
  // @ApiConsumes('application/json')
  // @ApiBearerAuth()
  // async getDetailConfig(@Query('key') key: string) {
  //   if (!key)
  //     throw new Exception(ErrorCode.Invalid_Input, 'Missing config key.');
  //   return await this.configService.getDetailConfig(key);
  // }
  //
  // @Put('/:key')
  // @RequirePermissions(Permissions.CONFIG_MANAGEMENT)
  // @ApiBody(updateConfigApiBody)
  // @ApiResponse(exampleResponse)
  // @ApiConsumes('application/json')
  // @ApiBearerAuth()
  // async updateConfig(@Body() body: any, @Query('key') key: string) {
  //   validate(updateConfigSchema, body);
  //   if (!key) throw ErrorCode.Invalid_Input;
  //   await this.configService.updateConfig(key, body);
  //   return;
  // }
}
