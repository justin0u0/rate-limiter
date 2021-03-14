# Overview

Source: https://github.com/justin0u0/rate-limiter

Implement a rate limiter middleware using redis.

# Usage

## Run server

```bash
git clone https://github.com/justin0u0/rate-limiter.git
cd rate-limiter
npm install
npm run docker-compose.dev:up # or run redis server locally with password='password'
npm run dev
```

## Testing
```bash
npx loadtest -n 2000 -c 100 http://localhost:7070/secret
```

## Result

Make 2000 requests within an hour.

We get `total errors 1000 => 429 Too many requests`.

![](/assets/rate-limiter-test.png)

# To Do

- [ ] Unit testing for `rateLimiterMiddleware`.
