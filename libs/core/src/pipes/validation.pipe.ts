import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from '../validate';
import { AjvSchema } from '@app/core/types/AJVSchema';

@Injectable()
export class ToIntPipe implements PipeTransform {
  transform(value: any) {
    if (!Number.isInteger(+value)) {
      throw new UnprocessableEntityException(
        'Validation failed (numeric string is expected)',
      );
    }

    return Number(value);
  }
}
@Injectable()
export class Validate implements PipeTransform {
  private readonly schemaRef: AjvSchema;

  constructor(schemaRef: AjvSchema) {
    this.schemaRef = schemaRef;
  }

  transform(value: any) {
    validate(this.schemaRef, value);
    return value;
  }
}
