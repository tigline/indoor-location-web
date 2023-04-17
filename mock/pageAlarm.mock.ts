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
          'items|200': [
            {
              alarmId: /\d{12}/,
              content: '@paragraph',
              mapId: '1635140740788903938',
              createTime: Date.now(),
              deviceId: /\d{12}/,
              fenceId: /\d{12}/,
              name: /卢磊|武平|侯娟|韩敏|林秀英|薛艳|程芳|袁勇|雷桂英|夏伟/,
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
