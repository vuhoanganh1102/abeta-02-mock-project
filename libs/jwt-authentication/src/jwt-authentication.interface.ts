export interface JwtAuthenticationModuleOptions {
  /**
   * Secret key
   */
  secretOrKey: string;
  accessTokenExpiredIn: string;
  refreshTokenExpiredIn: string;
}
