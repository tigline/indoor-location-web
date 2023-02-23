import { listMaps } from '@/services/swagger/xitongguanli';
import { useRequest } from '@umijs/max';
import { first, isEmpty } from 'lodash';
import React, { useEffect } from 'react';

export default () => {
  const [initialValue, setInitialValue] = React.useState<string>();
  const { run, data, loading } = useRequest(
    (): Promise<API.RestValueListMapInfo> => {
      if (!isEmpty(data)) {
        return Promise.resolve<API.RestValueListMapInfo>({ data, code: 200 });
      }
      return listMaps({});
    },
    {
      manual: true,
      onSuccess(data) {
        setInitialValue(first(data)?.mapId);
      },
    },
  );
  useEffect(() => {
    run();
  }, []);
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
