// @ts-ignore
import { Request, Response } from 'express';

export default {
  'GET /api/v1/buildings': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
