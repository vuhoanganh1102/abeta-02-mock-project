import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
  ArgumentMetadata,
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
  private schemaRef: AjvSchema;

  constructor(schemaRef: AjvSchema) {
    this.schemaRef = schemaRef;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    validate(this.schemaRef, value);
    return value;
  }
}
