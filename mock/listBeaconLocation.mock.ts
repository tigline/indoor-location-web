// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /api/v1/location': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        'data|10-20': [
          {
            deviceId: /\d{12}/,
            'id|1000-20000': 1,
            mapId: /\d{12}/,
            optScale: 1,
            'posX|10-200': 1,
            'posY|10-200': 1,
            timestamp: Date.now(),
          },
        ],
      }),
    );
  },
};
