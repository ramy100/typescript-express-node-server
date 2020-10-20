import redis from "redis";
import { promisify } from "util";

export const redisClient = redis.createClient(6379, "redis");
redisClient.on("error", function (error) {
  console.error(error);
});

export const redisGetAsync = promisify(redisClient.get).bind(redisClient);
