// @ts-ignore
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
  'GET /ips/api/v1/treeDepartment': (req: Request, res: Response) => {
    res.status(200).send(
      mock({
        code: 200,
        data: [
          { depId: 1, parentId: 0, name: '沃尔玛' },
          { depId: 2, parentId: 1, name: '生鲜区' },
          { depId: 3, parentId: 1, name: '日用品区' },
          { depId: 4, parentId: 2, name: '鱼' },
          { depId: 5, parentId: 2, name: '牛肉' },
          { depId: 6, parentId: 3, name: '卫生纸' },
          { depId: 7, parentId: 3, name: '牙刷' },
          { depId: 8, parentId: 7, name: '电动牙刷' },
          { depId: 9, parentId: 7, name: '普通牙刷' },
        ],
      }),
    );
  },
};
