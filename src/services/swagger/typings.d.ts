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
    angle?: number;
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

  type AddOrUpdateDepartment = {
    name: string;
    parentId?: number;
  };

  type AddOrUpdateFenceInfo = {
    mapId: string;
    name: string;
    points: Point[];
    type: 'In' | 'Out';
  };

  type AddOrUpdateMapInfo = {
    buildingId: string;
    floor: string;
    length?: number;
    lengthPx?: number;
    name: string;
    picture: string;
    width?: number;
    widthPx?: number;
  };

  type AddOrUpdatePersonnel = {
    avatar?: string;
    depId?: number;
    name: string;
    sex: 'Male' | 'Female';
    tag?: string;
    typeId: number;
  };

  type AddOrUpdatePersonnelType = {
    picture?: string;
    typeName: string;
  };

  type AddOrUpdateThing = {
    name?: string;
    picture?: string;
    tag?: string;
    typeId?: number;
  };

  type AddOrUpdateThingType = {
    picture?: string;
    typeName: string;
  };

  type AlarmInfo = {
    alarmId?: number;
    content?: string;
    createTime?: number;
    deviceId?: string;
    fenceId?: string;
    mapId?: string;
    name?: string;
    point?: Point;
    status?: 'Unprocessed' | 'Processed' | 'Ignored';
    type?: 'In' | 'Out';
    updateTime?: number;
  };

  type AoaDataInfo = {
    deviceId?: string;
    id?: number;
    mapId?: string;
    optScale?: number;
    posX?: number;
    posY?: number;
    timestamp?: number;
    type?: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
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
    online?: boolean;
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

  type dealWithAlarmParams = {
    alarmId: number;
    status: 'Unprocessed' | 'Processed' | 'Ignored';
  };

  type deleteAlarmParams = {
    /** 需要删除的id数组，以逗号分隔 */
    alarmIds: number[];
  };

  type deleteBeaconParams = {
    deviceId: string;
  };

  type deleteBuildingParams = {
    buildingId: string;
  };

  type deleteDepartmentParams = {
    depId: number;
  };

  type deleteFenceParams = {
    fenceId: string;
  };

  type deleteGatewayParams = {
    gateway: string;
  };

  type deleteMapParams = {
    mapId: string;
  };

  type deletePersonnelParams = {
    personnelId: number;
  };

  type deleteThingParams = {
    thingId: number;
  };

  type deleteThingTypeParams = {
    typeId: number;
  };

  type DepartmentTree = {
    depId?: number;
    name?: string;
    parentId?: number;
  };

  type FenceAndMapInfo = {
    enabled?: boolean;
    fenceId?: string;
    mapId?: string;
    mapName?: string;
    name?: string;
    points?: Point[];
    type?: 'In' | 'Out';
  };

  type FenceInfo = {
    enabled?: boolean;
    fenceId?: string;
    mapId?: string;
    name?: string;
    points?: Point[];
    type?: 'In' | 'Out';
  };

  type GatewayInfo = {
    angle?: number;
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

  type getFenceParams = {
    fenceId: string;
  };

  type getMapParams = {
    mapId: string;
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
    buildingId?: string;
    name?: string;
    hidePicture?: boolean;
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
    length?: number;
    lengthPx?: number;
    mapId?: string;
    name?: string;
    picture?: string;
    width?: number;
    widthPx?: number;
  };

  type OnlineCount = {
    count?: number;
    type?: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
  };

  type pageAlarmParams = {
    deviceId?: string;
    fenceId?: string;
    type?: 'In' | 'Out';
    status?: 'Unprocessed' | 'Processed' | 'Ignored';
    startTime?: number;
    endTime?: number;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageBeaconParams = {
    deviceId?: string;
    name?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageFenceParams = {
    mapId?: string;
    name?: string;
    type?: 'In' | 'Out';
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageGatewayParams = {
    mapId?: string;
    gateway?: string;
    name?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pagePersonnelParams = {
    searchValue?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pagePersonnelTypeParams = {
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type PageResultAlarmInfo = {
    current?: number;
    items?: AlarmInfo[];
    size?: number;
    total?: number;
  };

  type PageResultBeaconInfo = {
    current?: number;
    items?: BeaconInfo[];
    size?: number;
    total?: number;
  };

  type PageResultFenceAndMapInfo = {
    current?: number;
    items?: FenceAndMapInfo[];
    size?: number;
    total?: number;
  };

  type PageResultGatewayInfo = {
    current?: number;
    items?: GatewayInfo[];
    size?: number;
    total?: number;
  };

  type PageResultPersonnelFillInfo = {
    current?: number;
    items?: PersonnelFillInfo[];
    size?: number;
    total?: number;
  };

  type PageResultPersonnelTypeInfo = {
    current?: number;
    items?: PersonnelTypeInfo[];
    size?: number;
    total?: number;
  };

  type PageResultThingInfo = {
    current?: number;
    items?: ThingInfo[];
    size?: number;
    total?: number;
  };

  type PageResultThingTypeInfo = {
    current?: number;
    items?: ThingTypeInfo[];
    size?: number;
    total?: number;
  };

  type PageResultUserInfo = {
    current?: number;
    items?: UserInfo[];
    size?: number;
    total?: number;
  };

  type pageThingParams = {
    name?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageThingTypeParams = {
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type pageUserParams = {
    username?: string;
    nickname?: string;
    /** 当前页码 */
    current?: string;
    /** 每页数量 */
    size?: string;
  };

  type PersonnelFillInfo = {
    avatar?: string;
    depId?: number;
    depName?: string;
    name?: string;
    personnelId?: number;
    sex?: 'Male' | 'Female';
    tag?: string;
    typeId?: number;
    typeName?: string;
  };

  type PersonnelTypeInfo = {
    createTime?: number;
    picture?: string;
    typeId?: number;
    typeName?: string;
  };

  type Point = {
    x: number;
    y: number;
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

  type RestValueFenceInfo = {
    code?: number;
    data?: FenceInfo;
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

  type RestValueListDepartmentTree = {
    code?: number;
    data?: DepartmentTree[];
    errorDetail?: string;
    message?: string;
  };

  type RestValueListMapInfo = {
    code?: number;
    data?: MapInfo[];
    errorDetail?: string;
    message?: string;
  };

  type RestValueListOnlineCount = {
    code?: number;
    data?: OnlineCount[];
    errorDetail?: string;
    message?: string;
  };

  type RestValueMapInfo = {
    code?: number;
    data?: MapInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultAlarmInfo = {
    code?: number;
    data?: PageResultAlarmInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultBeaconInfo = {
    code?: number;
    data?: PageResultBeaconInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultFenceAndMapInfo = {
    code?: number;
    data?: PageResultFenceAndMapInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultGatewayInfo = {
    code?: number;
    data?: PageResultGatewayInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultPersonnelFillInfo = {
    code?: number;
    data?: PageResultPersonnelFillInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultPersonnelTypeInfo = {
    code?: number;
    data?: PageResultPersonnelTypeInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultThingInfo = {
    code?: number;
    data?: PageResultThingInfo;
    errorDetail?: string;
    message?: string;
  };

  type RestValuePageResultThingTypeInfo = {
    code?: number;
    data?: PageResultThingTypeInfo;
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

  type switchFenceStatusParams = {
    fenceId: string;
  };

  type ThingInfo = {
    name?: string;
    picture?: string;
    tag?: string;
    thingId?: number;
    typeId?: number;
  };

  type ThingTypeInfo = {
    createTime?: number;
    picture?: string;
    typeId?: number;
    typeName?: string;
  };

  type TokenInfo = {
    accessExpired?: number;
    accessToken?: string;
    refreshExpired?: number;
    refreshToken?: string;
  };

  type unbindTag1Params = {
    personnelId: number;
    tag: string;
  };

  type unbindTagParams = {
    thingId: number;
    tag: string;
  };

  type UpdateBeacon = {
    fenceIds?: string;
    name: string;
    type: 'Equipment' | 'Personnel' | 'Vehicle' | 'Stuff';
  };

  type updateBeaconParams = {
    deviceId: string;
  };

  type updateBuildingParams = {
    buildingId: string;
  };

  type updateDepartmentParams = {
    depId: number;
  };

  type updateFenceParams = {
    fenceId: string;
  };

  type UpdateGateway = {
    angle?: number;
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

  type updatePersonnelParams = {
    personnelId: number;
  };

  type updatePersonnelTypeParams = {
    typeId: number;
  };

  type updateThingParams = {
    thingId: number;
  };

  type updateThingTypeParams = {
    typeId: number;
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
