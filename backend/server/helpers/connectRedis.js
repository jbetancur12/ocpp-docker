import { createClient } from 'redis';

const redisUrl = `redis`;
const redisPort = "6379"
const redisClient = createClient({
  legacyMode: true,
  socket:{
    port: redisPort,
    host: process.env.REDIS_HOSTNAME,
  }
});
//
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected...');
  } catch (err) {
    console.log(err.message);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on('error', (err) => console.log(err));

export default redisClient;