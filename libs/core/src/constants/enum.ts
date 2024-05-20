export enum ErrorCode {
  // Common error
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',
  Too_Many_Requests = 'Too_Many_Requests',

  Email_Already_Exist = 'Email_Already_Exist',
  Email_Or_Password_Not_valid = 'Email_Or_Password_Not_valid',
  Email_Not_Valid = 'Email_Not_Valid',
  Password_Not_Valid = 'Password_Not_Valid',
  Resource_Already_Exists = 'Resource_Already_Exists',
  Can_Not_Disable_Default_language = 'Can_Not_Disable_Default_language',

  The_Allowed_Number_Of_Calls_Has_Been_Exceeded = 'The_Allowed_Number_Of_Calls_Has_Been_Exceeded',

  /**Message */
  Conversation_Not_Found = 'Conversation_Not_Found',
  Message_Not_Found = 'Message_Not_Found',
  You_Are_Not_Member_Of_This_Conversation = 'You_Are_Not_Member_Of_This_Conversation',
  You_Are_No_Longer_Active_In_This_Conversation = 'You_Are_No_Longer_Active_In_This_Conversation',

  Verify_Token_Fail = 'Verify_Token_Fail',
  Validate_fail = 'Validate_fail',
  User_In_Active = 'User_In_Active',
  Auth_Failed = 'Auth_Failed',
  Access_Denied = 'Access_Denied',
  Email_Already_Exists = 'Email_Already_Exists',
  Maximum_Retry_Verification_Code = 'Maximum_Retry_Verification_Code',
  Delay_Between_Retry_Required = 'Delay_Between_Retry_Required',

  Not_Found_User = 'Not_Found_User',
  User_Exist = 'User_Exist',
  Duplicate_Old_Password = 'Duplicate_Old_Password',
  Token_Expired = 'Token_Expired',
  Verification_Code_Invalid = 'Verification_Code_Invalid',
  User_Not_Found = 'User_Not_Found',
  Task_Duplicate = 'Task_Duplicate',
  Task_Not_Found = 'Task_Not_Found',
  Update_Task_Fail = 'Update_Task_Fail',
  OTP_Invalid = 'OTP_Invalid',
  OTP_Expired = 'OTP_Expired',
  Post_Not_Found = 'Post_Not_Found',
  Comment_Not_Found = 'Comment_Not_Found',
  Notification_Not_Found = 'Notification_Not_Found',
}

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum CommonStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  NOT_VERIFY = 2,
  REJECT = 3,
}

export enum Permissions {
  PERMISSION_MANAGEMENT = 1,
  CONFIG_MANAGEMENT = 2,
  RESOURCE_MANAGEMENT = 3,
  LANGUAGE_MANAGEMENT = 4,
}

export enum RoleId {
  ADMIN = 1,
  USER = 2,
}

export enum ResourceType {
  TERM = 1,
  POLICY = 2,
  HELP = 3,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  ALL = 3,
}

export enum RequestCodeType {
  REGISTER = 1,
  CHANGE_PASSWORD = 2,
}

export enum VerificationCodeStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  USE = 2,
}

export enum EmailType {
  TEST = 0,
}

export enum NotificationTargetType {
  COMMON = 1,
  ALL = 2,
}

export enum NotificationRedirectType {
  TEST = 1,
}

export enum QueueProcessor {
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  SEND_MAIL = 'SEND_MAIL',
}

export enum ReadNotification {
  UNREAD = 0,
  READ = 1,
}

export enum QueueName {
  SEND_MAIL = 'SEND_MAIL',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  ADMIN_PUSH_NOTIFICATION_ALL_MEMBERS = 'ADMIN_PUSH_NOTIFICATION_ALL_MEMBERS',
  PUSH_NOTIFICATION_WITH_PLAYER_ID = 'PUSH_NOTIFICATION_WITH_PLAYER_ID',
}
