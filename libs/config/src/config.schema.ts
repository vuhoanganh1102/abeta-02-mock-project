import { ApiBodyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */
export const updateConfigSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    value: {
      type: 'string',
    },
    type: {
      type: 'string',
      maxLength: 50,
    },
    order: {
      type: 'number',
    },
    isSystem: {
      type: 'number',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                          Response Example                                  */
/* -------------------------------------------------------------------------- */

export const exampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getConfigInfoExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const detailConfigExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                   ApiBody                                  */
/* -------------------------------------------------------------------------- */

export const updateConfigApiBody: ApiBodyOptions = {
  schema: updateConfigSchema,
  description: 'Api Update Config ',
  examples: { exampleResponse },
};
