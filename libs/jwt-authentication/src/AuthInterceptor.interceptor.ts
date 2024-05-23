import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private accessToken: string;

  constructor() {
    this.accessToken = 'your-access-token'; // Thay thế bằng cách bạn lấy token từ đâu đó (ví dụ: từ config hoặc service)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.headers.authorization = `Bearer ${this.accessToken}`;
    return next.handle();
  }
}
