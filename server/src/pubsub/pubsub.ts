import { RedisPubSub } from "graphql-redis-subscriptions";

const connect = {
    port: Number(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST!,
    // username: process.env.PG_USER!,
    // password: process.env.PG_PASSWORD!,
    // database: 'users',
}

const pubsub = new RedisPubSub({
    connection : {
        port: connect.port,
        host: connect.host
    }
});

export default pubsub;