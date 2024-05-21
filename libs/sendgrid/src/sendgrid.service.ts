import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '@app/sendgrid/sendgrid.module-definition';
import { SendGridModuleOptions } from '@app/sendgrid/sendgrid.interface';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import { readFile } from 'fs/promises';
import * as ejs from 'ejs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs').promises;
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
    console.log(receiver, subject, templateName, attachedData, html);
    const templatePath =
      'E:Hades_project/dev_intern_hades/finnal_mock/abeta-02-mock-project/libs/sendgrid/src/templates/reset-password.ejs';
    console.log(templatePath);
    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const html = ejs.render(template, attachedData || {});
      console.log(html);
    } catch (error) {
      console.error('Error reading or rendering template:', error);
    }
    // const mail = {
    //   from: this.options.sender,
    //   to: receiver,
    //   subject: subject,
    //   html: html,
    // };
    try {
      //   const info = await sendGrid.send(mail);
      //   this.logger.log(`Email sent! Info: ${info}`);
      console.log('ok');
    } catch (error) {
      this.logger.log('Send mail failed!: ', error.response.body);
    }
  }
}
