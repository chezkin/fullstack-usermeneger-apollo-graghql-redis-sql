import Redis, { RedisKey } from "ioredis";

const connect = {
    port: Number(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST!,
    // username: process.env.PG_USER!,
    // password: process.env.PG_PASSWORD!,
    // database: 'users',
}

export const redisConnect = new Redis(connect.port, connect.host);


const getListDataByKeys = async (keys: string) => {
    const listData: any[] = []
    const keysResult = await redisConnect.keys(keys);
    if (keysResult.length === 0) {
        // אין משתמשים רשומים
        return [];
    }
    await Promise.all(keysResult.map(async (key) => {
        const resultData = await redisConnect.get(key);
        if (resultData) {
            const objData = JSON.parse(resultData);
            listData.push(objData)
        }
    }));

    return listData;
};

const getDataByKey = async (key: RedisKey) => {
    try { 
        const data  = await redisConnect.get(key);
        if (data) {
            const objData= JSON.parse(data!);
            return objData;
        }
        return false;
     } catch (e) {
         return false;
     }
};

const setDataByKey = async (key: RedisKey, data: any ) => {
    try { 
        const req = await redisConnect.set(key, JSON.stringify(data));
         return data;
     } catch (e) {
         return false;
     }
};


export {
    getListDataByKeys,
    setDataByKey,
    getDataByKey,
}
