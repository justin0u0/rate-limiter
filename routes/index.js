import express from 'express';

import logger from '../libs/logger';
import rateLimiterMiddleware from '../middlewares/rateLimiter';

const router = express.Router();

router.use(rateLimiterMiddleware);

router.get('/secret', (req, res) => {
  logger.info(`Get secret successfully with IP ${req.ip}.`);
  res.json({ secret: 'Hello, world!', ip: req.ip });
});

export default router;
