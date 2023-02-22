// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';

export default {
  'GET /api/v1/maps/:mapId': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          buildingId: /\d{12}/,
          floor: /\d{12}/,
          length: 30,
          lengthPx: 0,
          mapId: /\d{12}/,
          name: '@name',
          picture: '@image(500x300)',
          width: 50,
          widthPx: 0,
        },
      }),
    );
  },
};
