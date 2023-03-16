// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/alarms': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          current: 1,
          'items|5-20': [
            {
              alarmId: /\d{12}/,
              content: '@paragraph',
              mapId: '1635140740788903938',
              createTime: Date.now(),
              deviceId: /\d{12}/,
              fenceId: /\d{12}/,
              point: {
                'x|0-6.10': 1,
                'y|0-6.10': 1,
              },
              status: /Unprocessed|Processed|Ignored/,
              type: /In|Out/,
              updateTime: Date.now(),
            },
          ],
          size: 20,
          total: 52,
        },
      }),
    );
  },
};
