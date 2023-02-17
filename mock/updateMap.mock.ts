// @ts-ignore
import { Request, Response } from 'express';

export default {
  'POST /api/v1/maps/:mapId': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
