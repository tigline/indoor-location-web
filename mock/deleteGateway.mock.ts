// @ts-ignore
import { Request, Response } from 'express';

export default {
  'DELETE /api/v1/gateway/:gateway': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
