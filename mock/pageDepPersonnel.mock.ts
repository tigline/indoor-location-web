// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/dep/personnel': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: {
          current: 1,
          'items|10-20': [
            {
              avatar: '@image(100x100)',
              'depId|1-9': 1,
              depName: '@name',
              name: '@cname',
              personnelId: /\d{12}/,
              sex: /Male|Female/,
              tag: '@name',
              typeId: /\d{12}/,
              typeName: '@name',
            },
          ],
          size: 20,
          total: 52,
        },
      }),
    );
  },
};
