// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/buildings': (req: Request, res: Response<API.RestValueListBuildingInfo>) => {
    res.status(200).send(
      mock({
        code: 200,
        'data|1-6': [
          {
            address: '@county(true)',
            buildingId: /\d{12}/,
            name: '@word(2,6)',
            picture: '@image(400x200)',
          },
        ],
        // message?: string | undefined;
      }),
    );
  },
};
