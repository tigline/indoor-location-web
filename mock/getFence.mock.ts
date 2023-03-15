// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/fences/:fenceId': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          enabled: true,
          fenceId: /\d{12}/,
          mapId: '1635140740788903938',
          name: '@name',
          points: [1, 2],
          type: /In|Out/,
        },
      }),
    );
  },
};
