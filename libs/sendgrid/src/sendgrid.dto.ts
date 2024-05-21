export class SendGridDto {
  receiver: string;
  subject: string;
  content: string;
  html?: string;
}
