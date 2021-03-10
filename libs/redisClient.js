import redis from 'async-redis';
import config from './config';
import logger from './logger';

const {
  redisHost,
  redisPort,
  redisPassword,
  redisDatabase,
} = config;

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  db: redisDatabase,
});

logger.info('Redis connection has been established successfully.');

export default redisClient;
