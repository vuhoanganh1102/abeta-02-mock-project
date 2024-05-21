import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { SendgridService } from '@app/sendgrid';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class checkObj {
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  to: string;
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  subject: string;
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  title: string;
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  content: string;
}
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sendgridService: SendgridService,
  ) {}

  // @UseGuards(AdminGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('send')
  async sendEmail(
    @Body()
    body: checkObj,
  ) {
    const context = {
      title: body.title,
      content: body.content,
    };
    await this.sendgridService.sendMail(
      body.to,
      body.subject,
      'reset-password',
      context,
      '',
    );
    return { message: 'Email sent successfully' };
    // console.log(body);
  }
}
