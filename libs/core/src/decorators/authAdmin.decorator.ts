import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.payload;
  },
);
