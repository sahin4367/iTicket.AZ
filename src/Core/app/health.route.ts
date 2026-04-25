import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../DAL/config/data-source';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  const dbOk = await AppDataSource.query('SELECT 1')
    .then(() => true)
    .catch(() => false);

  const status = {
    status: dbOk ? 'healthy' : 'degraded',
    checks: {
      database: dbOk ? 'up' : 'down',
      uptime: Math.floor(process.uptime()),
    },
    service: 'iticket-api',
    timestamp: new Date().toISOString(),
  };

  res.status(dbOk ? 200 : 503).json(status);
});