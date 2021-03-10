import express from 'express';

import config from './libs/config';
import logger from './libs/logger';
import router from './routes';

const app = express();

app.use(express.json());

app.use(router);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
