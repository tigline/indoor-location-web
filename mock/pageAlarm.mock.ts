// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /api/v1/alarms': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          current: 1,
          'items|5-20': [
            {
              alarmId: /\d{12}/,
              content: '@paragraph',
              createTime: Date.now(),
              deviceId: /\d{12}/,
              fenceId: /\d{12}/,
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
