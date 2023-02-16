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

  type AddOrUpdateMapInfo = {
    name: string;
    width: number;
    height: number;
    pixelWidth: number;
    pixelHeight: number;
    picture: string;
    remark?: string;
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
    fenceIds?: string;
    motion?: string;
    optScale?: number;
    positionType?: string;
    posX?: number;
    posY?: number;
    updateTime?: number;
    extraInfo?: string;
  };

  type deleteMapParams = {
    mapId: string;
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
    fenceIds?: string;
    setX?: number;
    setY?: number;
    setZ?: number;
    updateTime?: number;
    extraInfo?: string;
  };

  type listBeaconLocationParams = {
    mapId: string;
    startTime: string;
    endTime: string;
  };

  type listMapsParams = {
    name?: string;
  };

  type LoginInfo = {
    username: string;
    password: string;
  };

  type loginParams = {
    Authorization?: any;
  };

  type MapInfo = {
    mapId?: string;
    name?: string;
    width?: number;
    height?: number;
    pixelWidth?: number;
    pixelHeight?: number;
    picture?: string;
    remark?: string;
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

  type RestValueListMapInfo = {
    code?: number;
    message?: string;
    data?: MapInfo[];
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

  type updateMapParams = {
    mapId: string;
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
