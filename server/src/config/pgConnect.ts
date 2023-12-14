import { Pool } from 'pg';

const connect = {
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
    host: process.env.PG_HOST!,
    port: Number(process.env.PG_PORT!),
    database: 'db',
}

console.log('connect', connect);

const postgresPool = new Pool(connect)


export default postgresPool