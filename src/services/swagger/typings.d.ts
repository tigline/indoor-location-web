declare namespace API {
  type LoginInfo = {
    username: string;
    password: string;
  };

  type loginParams = {
    Authorization?: any;
  };

  type refreshTokenParams = {
    Authorization?: any;
    refreshToken: string;
  };

  type registerParams = {
    Authorization?: any;
  };

  type RegistryInfo = {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
    phone?: string;
  };

  type RestValueBoolean = {
    code?: number;
    message?: string;
    data?: boolean;
    errorDetail?: string;
  };

  type RestValueTokenInfo = {
    code?: number;
    message?: string;
    data?: TokenInfo;
    errorDetail?: string;
  };

  type RestValueUserInfo = {
    code?: number;
    message?: string;
    data?: UserInfo;
    errorDetail?: string;
  };

  type TokenInfo = {
    accessToken?: string;
    accessExpired?: number;
    refreshToken?: string;
    refreshExpired?: number;
  };

  type UpdateUserInfo = {
    nickname?: string;
    email?: string;
    phone?: string;
  };

  type updateUserInfoParams = {
    userId: number;
  };

  type UserInfo = {
    userId?: number;
    username?: string;
    password?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    role?: 'Admin' | 'User';
  };
}
