declare namespace API {
  type LoginInfo = {
    username: string;
    password: string;
  };

  type refreshTokenParams = {
    refreshToken: string;
  };

  type RegistryInfo = {
    username: string;
    password: string;
    nickname?: string;
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

  type TokenInfo = {
    accessToken?: string;
    accessExpired?: number;
    refreshToken?: string;
    refreshExpired?: number;
  };
}
