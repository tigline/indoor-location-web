import { listMaps } from '@/services/swagger/xitongguanli';
import { useRequest } from '@umijs/max';
import { first } from 'lodash';
import React, { useEffect } from 'react';

export default () => {
  const [initialValue, setInitialValue] = React.useState<string>();
  const { run, data, loading } = useRequest(listMaps, {
    manual: true,
    onSuccess(data) {
      setInitialValue(first(data)?.mapId);
    },
  });
  useEffect(() => {
    run({});
  }, []);
  const options = (data ?? []).map((item) => ({
    label: item.name,
    value: item.mapId,
  }));
  return {
    data,
    options,
    loading,
    initialValue,
  };
};
