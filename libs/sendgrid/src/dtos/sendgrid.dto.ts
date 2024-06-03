export class SendgridDto{
    receiver: string
    subject: string
    templateName: string
    attachedData?: any
    html?: string
}