import { SetMetadata } from '@nestjs/common';

export const IS_CLIENT_API = 'isCLientApi';
/**
 * Mark this as the public API
 *
 * Put it before the method you want to ignore check authentication.
 */
export const ClientApi = () => SetMetadata(IS_CLIENT_API, true);
