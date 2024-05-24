import { Client } from 'onesignal-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateNotificationBody } from 'onesignal-node/lib/types';
import * as process from 'process';
import { IConfig } from 'apps/mock-project/src/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class OnesignalService {
  client: any;
  memberTag: string;
  isReceivedNotificationTag: string;

  constructor(private readonly configService: ConfigService<IConfig, true>) {
    this.client = new Client(
      process.env.ONESIGNAL_APP_ID,
      process.env.ONESIGNAL_API_KEY,
    );
  }

  async pushNotification(
    playerIds: number[],
    title: string,
    content: string,
  ): Promise<{ msg: string }> {
    const filters = playerIds.map((id, index) => ({
      field: 'tag',
      key: 'user',
      relation: '=',
      value: id,
    }));
    const notification: CreateNotificationBody = {
      headings: {
        en: title,
      },
      contents: {
        en: content,
      },
      filters: filters,
    };

    try {
      await this.client.createNotification(notification);
      return {
        msg: 'Create notification completed',
      };
    } catch (error) {
      throw new Error('Failed to create notification: ' + error.message);
    }
  }
}
