import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.PG_URI;


const postgresPool = new Pool({ connectionString });


export default postgresPool