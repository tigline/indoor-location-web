

export function getDeviceFrequency(alarmInfos: API.AlarmInfo[]): API.DeviceFrequency[] {
  const deviceFrequency: Record<string, number> = {};

  alarmInfos.forEach(info => {
    if (info.deviceId != undefined) {
      if (info.deviceId in deviceFrequency) {
        deviceFrequency[info.deviceId]++;
      } else {
        deviceFrequency[info.deviceId] = 1;
      }
    }
  });

  const sortedDeviceFrequency: API.DeviceFrequency[] = Object.entries(deviceFrequency)
    .map(([deviceId, frequency]) => ({ deviceId, frequency: Number(frequency) }))
    .sort((a, b) => b.frequency - a.frequency);

  return sortedDeviceFrequency;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}


