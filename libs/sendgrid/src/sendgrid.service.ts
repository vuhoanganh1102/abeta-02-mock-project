import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '@app/sendgrid/sendgrid.module-definition';
import { SendGridModuleOptions } from '@app/sendgrid/sendgrid.interface';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import { readFile } from 'fs/promises';
import * as ejs from 'ejs';

@Injectable()
export class SendgridService {
  private readonly logger: Logger = new Logger(SendgridService.name);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: SendGridModuleOptions,
  ) {
    sendGrid.setApiKey(this.options.apiKey);
  }

  async sendMail(
    receiver: string,
    subject: string,
    templateName: string,
    attachedData?: any,
    html?: string,
  ) {
    const templatePath = path.join(
      __dirname,
      '..',
      'libs',
      'sendgrid',
      'src',
      'templates',
      `${templateName}.ejs`,
    );
    const template = await readFile(templatePath, 'utf-8');
    html = ejs.render(template, attachedData || {});
    const mail = {
      from: this.options.sender,
      to: receiver,
      subject: subject,
      html: html,
    };
    try {
      const info = await sendGrid.send(mail);
      this.logger.log(`Email sent! Info: ${info}`);
    } catch (error) {
      this.logger.log('Send mail failed!: ', error.response.body);
    }
  }
}
