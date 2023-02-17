// @ts-ignore
import { Request, Response } from 'express';

export default {
  'PUT /api/v1/beacon/:deviceId': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
