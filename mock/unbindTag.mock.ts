// @ts-ignore
import { Request, Response } from 'express';

export default {
  'DELETE /api/v1/things/:thingId/:tag': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
