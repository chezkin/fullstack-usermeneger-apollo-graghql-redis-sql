import Redis from "ioredis";

const connect = {
    port: Number(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST!,
    // username: process.env.PG_USER!,
    // password: process.env.PG_PASSWORD!,
    // database: 'users',
}

export const redisConnect = new Redis(connect.port, connect.host);

