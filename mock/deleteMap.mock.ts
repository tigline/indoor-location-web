// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'DELETE /ips/api/v1/maps/:mapId': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: true,
      }),
    );
  },
};
