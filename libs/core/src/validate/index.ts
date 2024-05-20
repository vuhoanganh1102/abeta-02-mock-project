import { isBetween } from '@app/helpers';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { first } from 'lodash';
import { UnprocessableEntity } from '../exception';
import { AjvSchema } from '@app/core/types/AJVSchema';

// Ex: 2021-06-19T00:00:00.000Z
const ISOStringRegex = new RegExp(
  '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$',
);

export const AjvInstance = new Ajv();
addFormats(AjvInstance as any);

AjvInstance.addFormat('ISOString', {
  validate: (dateTimeString: string) => {
    try {
      const isMatchRegex = ISOStringRegex.test(dateTimeString);
      const isValidDate = new Date(dateTimeString);
      return !!isMatchRegex && !!isValidDate;
    } catch (error) {
      return false;
    }
  },
});

AjvInstance.addFormat('latitude', {
  validate: (lat: string) => isBetween(lat, '-90', '90'),
});

AjvInstance.addFormat('longitude', {
  validate: (lng: string) => isBetween(lng, '-180', '180'),
});

AjvInstance.addFormat('integer', {
  validate: (num: number) => Number.isInteger(+num),
});

const unexpectedFields = ['description', 'example', 'examples'];
export function removeUnexpectedField(schemaKeyRef: AjvSchema | any) {
  schemaKeyRef = JSON.parse(JSON.stringify(schemaKeyRef));
  const keys = Object.keys(schemaKeyRef);

  unexpectedFields.forEach((item) => {
    delete schemaKeyRef[item];
  });

  keys.forEach((key) => {
    if (typeof schemaKeyRef[key] === 'object') {
      removeUnexpectedField(schemaKeyRef[key]);
    }
  });
}

export function validate(schemaKeyRef: AjvSchema | any, data: any) {
  removeUnexpectedField(schemaKeyRef);

  const validate = AjvInstance.validate(schemaKeyRef, data);
  if (!validate) {
    if (AjvInstance?.errors?.length === 1) {
      throw new UnprocessableEntity(first(AjvInstance.errors));
    } else {
      throw new UnprocessableEntity(AjvInstance.errors);
    }
  }
  return true;
}
