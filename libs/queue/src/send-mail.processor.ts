import {OnQueueCompleted, OnQueueFailed, Process, Processor} from "@nestjs/bull";
import {QueueName, QueueProcessor} from "@app/core/constants/enum";
import {SendgridService} from "@app/sendgrid";
import {Job} from "bull";

@Processor(QueueProcessor.SEND_MAIL)
export class SendMailProcessor{
    constructor(
        private readonly sendGridService: SendgridService
    ) {
    }

    @Process(QueueName.SEND_MAIL)
    async handleSendMailQueue(job: Job){
        const receiverEmail = job.data.receiverEmail
        const subject = job.data.subject
        const template = job.data.template
        const link = job.data.link
        await this.sendGridService.sendMail(receiverEmail, subject, template, link)
    }

    @OnQueueCompleted()
    async onSendMailQueueCompleted(job: Job){
        console.log('Complete Send-mail Job: ' + job.id)
    }

    @OnQueueFailed()
    async onSendMailQueueFailed(job: Job){
        console.log('Send-mail Job Failed: ' + job.id)
        console.log('Reason: ' + job.failedReason)
    }
}