// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /api/v1/location': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        'data|7000-7500': [
          {
            deviceId: /\d{12}/,
            'id|1000-20000': 1,
            mapId: '1635140740788903938',
            type: /Equipment|Personnel|Vehicle|Stuff/,
            optScale: 1,
            'posX|0-6.10': 1,
            'posY|0-6.10': 1,
            timestamp: Date.now(),
          },
        ],
      }),
    );
  },
};
