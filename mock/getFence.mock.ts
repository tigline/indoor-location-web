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
          points: [
            { x: 1.61, y: 1.02 },
            { x: 2.35, y: 1 },
            { x: 2.38, y: 2.53 },
            { x: 1.61, y: 2.53 },
            { x: 1.61, y: 1.02 },
          ],
          type: /In|Out/,
        },
      }),
    );
  },
};
