/**
 * Assume that there is no reverse-proxy in front of the API server,
 * so just use req.ip instead of using req.headers['X-Forwarded-For']
 */

import logger from '../libs/logger';
import redisClient from '../libs/redisClient';

const rateLimiterMiddleware = async (req, res, next) => {
  const hourToSeconds = 3600;
  const maximumRequestsInHour = 1000;

  try {
    const rateLimitKey = `rate-limit:${req.ip}`;

    /**
     * 1. Start redis transaction using MULTI command. https://redis.io/commands/incr
     * 2. Set a new key that expired in 1 hour and default to 0 request if the key not exist. https://redis.io/commands/set
     * 3. Increase the request count by 1 using INCR command. https://redis.io/commands/incr
     * 4. Get rate limit reset time by the TTL of the key using TTL command. https://redis.io/commands/ttl
     * 5. Execute the command
     */
    const { totalRequestInHour, rateLimitReset } = await new Promise((resolve, reject) => {
      redisClient.multi()
        .set(rateLimitKey, 0, 'EX', hourToSeconds, 'NX')
        .incr(rateLimitKey)
        .ttl(rateLimitKey)
        .exec((err, replies) => {
          if (err) reject(err);
          resolve({
            totalRequestInHour: replies[1],
            rateLimitReset: replies[2],
          });
        });
    });

    logger.debug(`[rateLimiterMiddleware] IP ${req.ip}, totalRequestInHour ${totalRequestInHour}, rateLimitReset ${rateLimitReset}.`);

    if (totalRequestInHour > maximumRequestsInHour) {
      return res.status(429).json({ error: 'Too many requests.' });
    }

    res.set({
      'X-RateLimit-Remaining': maximumRequestsInHour - totalRequestInHour,
      'X-RateLimit-Reset': rateLimitReset,
    });

    return next();
  } catch (error) {
    logger.error('[rateLimiterMiddleware]', error);
    return res.status(400).json({ error: error.message });
  }
};

export default rateLimiterMiddleware;
