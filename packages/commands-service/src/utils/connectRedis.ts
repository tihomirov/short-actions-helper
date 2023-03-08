import { createClient } from 'redis';

const RECONNECT_TIMEOUT = 5 * 1000;

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err: unknown) {
    setTimeout(connectRedis, RECONNECT_TIMEOUT);
  }
};

redisClient.on('error', (err) => console.log('Redis Error', err));
