import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_API = 'isAdminApi';
/**
 * Mark this as the public API
 *
 * Put it before the method you want to ignore check authentication.
 */
export const AdminApi = () => SetMetadata(IS_ADMIN_API, true);
