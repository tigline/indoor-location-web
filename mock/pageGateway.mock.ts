// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /api/v1/gateway': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          current: 1,
          'items|20': [
            {
              angle: 0,
              extraInfo: 0,
              fenceIds: /\d{12}/,
              gateway: /\d{12}/,
              groupId: /\d{12}/,
              hisX: 0,
              hisY: 0,
              hisZ: 0,
              ip: '@ip',
              mapId: /\d{12}/,
              name: '@name',
              productName: '@name',
              'setX|0-50': 1.1,
              'setY|0-30': 1.1,
              setZ: 0,
              status: /Online|Offline/,
              systemId: /\d{12}/,
              type: 'Gateway',
              updateTime: '@datetime',
            },
          ],
          total: 20,
        },
      }),
    );
  },
};
