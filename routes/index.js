import express from 'express';

import logger from '../libs/logger';

const router = express.Router();

router.get('/secret', (req, res) => {
  logger.info(req.ip);
  res.json({ secret: 'Hello, world!' });
});

export default router;
