import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err: unknown) {
    setTimeout(connectRedis, 5000);
  }
};

redisClient.on('error', (err) => console.log('Redis Error', err));
