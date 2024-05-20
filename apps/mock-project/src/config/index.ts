/* eslint-disable @typescript-eslint/no-var-requires */
import { dataSource } from '@app/database-type-orm/data-source';
require('dotenv').config();
import { first } from 'lodash';
import { Environment } from '@app/core/constants/enum';
import { AjvInstance } from '@app/core/validate';
import { UnprocessableEntity } from '@app/core/exception';
import { AjvSchema } from '@app/core/types/AJVSchema';

const config = {
  nodeEnv: process.env.NODE_ENV || Environment.Development,
  port: Number(process.env.PORT) || 3000,
  appName: 'Notification',
  oneSignal: {
    appId: process.env.APP_ID,
    restKey: process.env.REST_KEY,
  },
  auth: {
    secretOrKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiredIn: '10d',
    refreshTokenExpiredIn: '365d',
  },
  sendGrid: {
    sender: process.env.SENDGRID_SENDER,
    apiKey: process.env.SENDGRID_API_KEY,
  },
  // twilio: {
  //   sid: process.env.TWILIO_SID,
  //   authToken: process.env.TWILIO_AUTH_TOKEN,
  //   phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  // },
  // queue: {
  //   host: process.env.QUEUE_HOST || 'localhost',
  //   port: process.env.QUEUE_PORT || 6379,
  //   prefix: process.env.QUEUE_PREFIX || '',
  // },
};

const validateConfigSchema: AjvSchema = {
  type: 'object',
  required: ['nodeEnv', 'port'],
  additionalProperties: false,
  properties: {
    nodeEnv: {
      type: 'string',
      enum: Object.values(Environment),
    },
    port: {
      type: 'integer',
      minimum: 0,
      default: 3000,
    },
    auth: {
      type: 'object',
      additionalProperties: false,
      properties: {
        secretOrKey: {
          type: 'string',
          minLength: 1,
        },
        accessTokenExpiredIn: {
          type: 'string',
          minLength: 1,
        },
        refreshTokenExpiredIn: {
          type: 'string',
          minLength: 1,
        },
      },
    },
    sendGrid: {
      type: 'object',
      additionalProperties: false,
      properties: {
        sender: {
          type: 'string',
          minLength: 1,
          format: 'email',
        },
        apiKey: {
          type: 'string',
          minLength: 1,
        },
      },
    },
    // twilio: {
    //   type: 'object',
    //   additionalProperties: false,
    //   properties: {
    //     sid: {
    //       type: 'string',
    //       minLength: 1,
    //     },
    //     authToken: {
    //       type: 'string',
    //       minLength: 1,
    //     },
    //     phoneNumber: {
    //       type: 'string',
    //       minLength: 1,
    //     },
    //   },
    // },
    // queue: {
    //   type: 'object',
    //   additionalProperties: false,
    //   properties: {
    //     host: {
    //       type: 'string',
    //       minLength: 1,
    //     },
    //     port: {
    //       type: 'integer',
    //       minimum: 1,
    //     },
    //     prefix: {
    //       type: 'string',
    //     },
    //   },
    // },
    appName: {
      type: 'string',
    },
    oneSignal: {
      type: 'object',
      additionalProperties: false,
      properties: {
        appId: {
          type: 'string',
        },
        restKey: {
          type: 'string',
        },
      },
    },
  },
};

export const validateConfig = (_config: Record<string, unknown>) => {
  const validate = AjvInstance.validate(validateConfigSchema, config);

  if (!validate) {
    console.error('validateConfig', AjvInstance?.errors);
    if (AjvInstance?.errors?.length === 1) {
      throw new UnprocessableEntity(first(AjvInstance.errors));
    } else {
      throw new UnprocessableEntity(AjvInstance.errors);
    }
  }
  return _config;
};

export interface IConfigAuth {
  secretOrKey: string;
  accessTokenExpiredIn: string;
  refreshTokenExpiredIn: string;
}

export interface IConfigSendGrid {
  sender: string;
  apiKey: string;
}

// export interface IConfigQueue {
//   host: string;
//   port: number;
//   prefix: string;
// }
//
// export interface IConfigTwilio {
//   sid: string;
//   authToken: string;
//   phoneNumber: string;
// }

export interface IConfigOneSignal {
  restKey: string;
  appId: string;
}
export interface IConfig {
  nodeEnv: Environment;
  port: number;
  auth: IConfigAuth;
  typeORMOptions: typeof dataSource;
  sendGrid: IConfigSendGrid;
  // twilio: IConfigTwilio;
  // queue: IConfigQueue;
  appName: string;
  oneSignal: IConfigOneSignal;
}

export default config;
