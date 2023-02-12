declare namespace API {
  type AddBeaconInfo = {
    deviceId: string;
    gateway?: string;
    mac?: string;
    mapId?: string;
    groupId?: string;
    name?: string;
    productName?: string;
  };

  type AddGatewayInfo = {
    gateway: string;
    mapId?: string;
    groupId?: string;
    name?: string;
    productName?: string;
  };

  type AoaDataInfo = {
    id?: number;
    deviceId?: string;
    mapId?: string;
    optScale?: number;
    posX?: number;
    posY?: number;
    timestamp?: number;
  };

  type BeaconInfo = {
    deviceId?: string;
    mac?: string;
    gateway?: string;
    mapId?: string;
    groupId?: string;
    name?: string;
    productName?: string;
    systemId?: string;
    type?: string;
    status?: string;
    motion?: string;
    optScale?: number;
    positionType?: string;
    posX?: number;
    posY?: number;
    updateTime?: number;
    extraInfo?: string;
    efenceIds?: string;
  };

  type GatewayInfo = {
    gateway?: string;
    mapId?: string;
    groupId?: string;
    name?: string;
    productName?: string;
    systemId?: string;
    type?: string;
    status?: string;
    ip?: string;
    setX?: number;
    setY?: number;
    setZ?: number;
    updateTime?: number;
    extraInfo?: string;
    eFenceIds?: string;
  };

  type listBeaconLocationParams = {
    mapId: string;
    startTime: string;
    endTime: string;
  };

  type LoginInfo = {
    username: string;
    password: string;
  };

  type loginParams = {
    Authorization?: any;
  };

  type pageBeaconParams = {
    deviceId?: string;
    name?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageGatewayParams = {
    gateway?: string;
    name?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type PageResultBeaconInfo = {
    current?: number;
    size?: number;
    total?: number;
    items?: BeaconInfo[];
  };

  type PageResultGatewayInfo = {
    current?: number;
    size?: number;
    total?: number;
    items?: GatewayInfo[];
  };

  type PageResultUserInfo = {
    current?: number;
    size?: number;
    total?: number;
    items?: UserInfo[];
  };

  type pageUserParams = {
    username?: string;
    nickname?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
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

  type RestValueListAoaDataInfo = {
    code?: number;
    message?: string;
    data?: AoaDataInfo[];
    errorDetail?: string;
  };

  type RestValuePageResultBeaconInfo = {
    code?: number;
    message?: string;
    data?: PageResultBeaconInfo;
    errorDetail?: string;
  };

  type RestValuePageResultGatewayInfo = {
    code?: number;
    message?: string;
    data?: PageResultGatewayInfo;
    errorDetail?: string;
  };

  type RestValuePageResultUserInfo = {
    code?: number;
    message?: string;
    data?: PageResultUserInfo;
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
    userId: string;
  };

  type UserInfo = {
    userId?: string;
    username?: string;
    password?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    role?: 'SuperAdmin' | 'Admin' | 'User';
  };
}
