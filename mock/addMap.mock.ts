// @ts-ignore
import { Request, Response } from 'express';

export default {
  'POST /api/v1/maps': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
