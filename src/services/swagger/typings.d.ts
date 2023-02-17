declare namespace API {
  type AddBeaconInfo = {
    deviceId: string;
    gateway?: string;
    groupId?: string;
    mac?: string;
    mapId?: string;
    name?: string;
    productName?: string;
    type: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
  };

  type AddGatewayInfo = {
    gateway: string;
    groupId?: string;
    mapId?: string;
    name?: string;
    productName?: string;
    setX?: number;
    setY?: number;
    setZ?: number;
    type?: 'Gateway';
  };

  type AddOrUpdateBuilding = {
    address?: string;
    name: string;
    picture?: string;
  };

  type AddOrUpdateMapInfo = {
    buildingId: string;
    floor: string;
    name: string;
    picture: string;
  };

  type AoaDataInfo = {
    deviceId?: string;
    id?: number;
    mapId?: string;
    optScale?: number;
    posX?: number;
    posY?: number;
    timestamp?: number;
  };

  type BeaconInfo = {
    deviceId?: string;
    extraInfo?: string;
    fenceIds?: string;
    gateway?: string;
    groupId?: string;
    mac?: string;
    mapId?: string;
    motion?: string;
    name?: string;
    optScale?: number;
    posX?: number;
    posY?: number;
    positionType?: string;
    productName?: string;
    status?: 'Bound' | 'Unbound';
    systemId?: string;
    type?: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
    updateTime?: number;
  };

  type BuildingInfo = {
    address?: string;
    buildingId?: string;
    name?: string;
    picture?: string;
  };

  type deleteBeaconParams = {
    deviceId: string;
  };

  type deleteBuildingParams = {
    buildingId: string;
  };

  type deleteGatewayParams = {
    gateway: string;
  };

  type deleteMapParams = {
    mapId: string;
  };

  type GatewayInfo = {
    extraInfo?: string;
    fenceIds?: string;
    gateway?: string;
    groupId?: string;
    hisX?: number;
    hisY?: number;
    hisZ?: number;
    ip?: string;
    mapId?: string;
    name?: string;
    productName?: string;
    setX?: number;
    setY?: number;
    setZ?: number;
    status?: 'Online' | 'Offline';
    systemId?: string;
    type?: 'Gateway';
    updateTime?: number;
  };

  type listBeaconLocationParams = {
    mapId: string;
    startTime: string;
    endTime: string;
    deviceId?: string;
  };

  type listBuildingParams = {
    name?: string;
  };

  type listMapsParams = {
    buildingId: string;
    name?: string;
  };

  type LoginInfo = {
    password: string;
    username: string;
  };

  type loginParams = {
    Authorization?: any;
  };

  type MapInfo = {
    buildingId?: string;
    floor?: string;
    mapId?: string;
    name?: string;
    picture?: string;
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
    items?: BeaconInfo[];
    size?: number;
    total?: number;
  };

  type PageResultGatewayInfo = {
    current?: number;
    items?: GatewayInfo[];
    size?: number;
    total?: number;
  };

  type PageResultUserInfo = {
    current?: number;
    items?: UserInfo[];
    size?: number;
    total?: number;
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
    email?: string;
    nickname?: string;
    password: string;
    phone?: string;
    username: string;
  };

  type RestValueBoolean = {
    code?: number;
    data?: boolean;
    errorDetail?: string;
    message?: string;
  };

  type RestValueListAoaDataInfo = {
    code?: number;
    data?: AoaDataInfo[];
    errorDetail?: string;
    message?: string;
  };

  type RestValueListBuildingInfo = {
    code?: number;
    data?: BuildingInfo[];
    errorDetail?: string;
    message?: string;
  };

  type RestValueListMapInfo = {
    code?: number;
    data?: MapInfo[];
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultBeaconInfo = {
    code?: number;
    data?: PageResultBeaconInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultGatewayInfo = {
    code?: number;
    data?: PageResultGatewayInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultUserInfo = {
    code?: number;
    data?: PageResultUserInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValueTokenInfo = {
    code?: number;
    data?: TokenInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValueUserInfo = {
    code?: number;
    data?: UserInfo;
    errorDetail?: string;
    message?: string;
  };

  type TokenInfo = {
    accessExpired?: number;
    accessToken?: string;
    refreshExpired?: number;
    refreshToken?: string;
  };

  type UpdateBeacon = {
    name: string;
    type: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
  };

  type updateBeaconParams = {
    deviceId: string;
  };

  type updateBuildingParams = {
    buildingId: string;
  };

  type UpdateGateway = {
    mapId: string;
    name: string;
    setX?: number;
    setY?: number;
    setZ?: number;
  };

  type updateGatewayParams = {
    gateway: string;
  };

  type updateMapParams = {
    mapId: string;
  };

  type UpdateUserInfo = {
    email?: string;
    nickname?: string;
    phone?: string;
  };

  type updateUserInfoParams = {
    userId: string;
  };

  type UserInfo = {
    email?: string;
    nickname?: string;
    password?: string;
    phone?: string;
    role?: 'SuperAdmin' | 'Admin' | 'User';
    userId?: string;
    username?: string;
  };
}
