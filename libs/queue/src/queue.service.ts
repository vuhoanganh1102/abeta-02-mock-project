import { Injectable } from '@nestjs/common';
import {InjectQueue} from "@nestjs/bull";
import {QueueName} from "@app/core/constants/enum";
import Bull, {Queue} from "bull";

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(QueueName.SEND_MAIL)
        private readonly sendMailQueue: Queue,
    ) {
    }

    async addSendMailQueue(name: QueueName, data: any, options?: Bull.JobOptions){
        await this.sendMailQueue.add(name, {...data}, {
            ...options
        })
    }
}
