// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/maps': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        'data|1-20': [
          {
            buildingId: /\d{12}/,
            floor: '@name',
            mapId: /\d{12}/,
            name: '@name',
            picture: '@image(400x200)',
          },
        ],
        total: 52,
      }),
    );
  },
};
