import Redis, { RedisKey } from "ioredis";

const redis = new Redis();

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