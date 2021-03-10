import express from 'express';

import config from './libs/config';
import logger from './libs/logger';

const app = express();

app.use(express.json());

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
