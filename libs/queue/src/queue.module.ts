import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import {BullModule} from "@nestjs/bull";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {IConfig, IConfigQueue} from "../../../apps/mock-project/src/config";
import * as process from "process";
import {QueueProcessor} from "@app/core/constants/enum";
import {SendgridModule} from "@app/sendgrid";
import {IConfigSendGrid} from "../../../apps/admin/src/config";
import {SendMailProcessor} from "@app/queue/send-mail.processor";
require('dotenv').config

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IConfig>) => ({
        redis: {
          host: configService.get<IConfigQueue>('queue').host,
          port: configService.get<IConfigQueue>('queue').port,
        },
        prefix: configService.get<IConfigQueue>('queue').prefix,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 10,
        }
      }),
      inject: [ConfigService]
    }),

    BullModule.registerQueue(
      {
        name: QueueProcessor.SEND_MAIL,
      },
      {
        name: QueueProcessor.NOTIFICATION,
      }
    ),
  ],
  providers: [QueueService, SendMailProcessor],
  exports: [QueueService, SendMailProcessor],
})
export class QueueModule {}
