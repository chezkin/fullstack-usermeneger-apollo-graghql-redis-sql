import Redis, { RedisKey } from "ioredis";

const connect = {
    port: Number(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST!,
    // username: process.env.PG_USER!,
    // password: process.env.PG_PASSWORD!,
    // database: 'users',
}




const redis = new Redis(connect.port, connect.host);

const get = async (key: RedisKey) => {
    try {
        const data = await redis.get(key);
        if (data)
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

const set = async (key: RedisKey, data: any) => {
    try {
        await redis.set(key, JSON.stringify(data));
        return true;
    } catch (e) {
        return false;
    }
};

export { get, set }