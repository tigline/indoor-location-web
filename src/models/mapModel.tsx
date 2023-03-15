import { listMaps } from '@/services/swagger/xitongguanli';
import { useRequest } from '@umijs/max';
import { first, isEmpty } from 'lodash';
import React from 'react';

export default () => {
  const [initialValue, setInitialValue] = React.useState<string>();
  const { run, data, loading } = useRequest(
    (flag?: boolean): Promise<API.RestValueListMapInfo> => {
      if (!isEmpty(data) && !flag) {
        return Promise.resolve<API.RestValueListMapInfo>({ data, code: 200 });
      }
      return listMaps({});
    },
    {
      debounceInterval: 100,
      manual: true,
      onSuccess(data) {
        setInitialValue(first(data)?.mapId);
      },
    },
  );
  // React.useEffect(() => {
  //   run();
  // }, []);
  const options = (data ?? []).map((item) => ({
    label: item.name,
    value: item.mapId,
  }));
  return {
    run,
    data,
    options,
    loading,
    initialValue,
  };
};
