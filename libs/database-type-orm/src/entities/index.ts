import { Admin } from './Admin.entity';
import { User } from './User.entity';
import { Attendance } from './Attendance.entity';
import { CompanyConfig } from './CompanyConfig.entity';
import { EmailOtp } from './EmailOtp.entity';
import { Notification } from './Notification.entity';
import { UserNotification } from './UserNotification.entity';
import { Request } from './Request.entity';
import { RequestAdmin } from './RequestAdmin.entity';

export const DefaultEntities = [
  Admin,
  User,
  Attendance,
  CompanyConfig,
  EmailOtp,
  Notification,
  UserNotification,
  Request,
  RequestAdmin,
];
export default DefaultEntities;
