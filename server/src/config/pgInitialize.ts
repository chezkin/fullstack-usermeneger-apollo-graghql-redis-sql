import postgresPool from './pgConnect'

export const connectToPostgres = async () => {
    const connect = await postgresPool.connect()
    console.log("Connecting to postgres");
    connect.release();
};

export const creatTableToPostgres = async () => {
    const client = await postgresPool.connect();
    console.log("Connecting to Postgres");

    // Create User table if not exists
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            isadmin BOOLEAN NOT NULL
        );
    `);

    client.release();
    console.log("Connected to Postgres and User table created");
};

export const initializeUserData = async () => {
    const client = await postgresPool.connect();
    console.log("Initializing User data");

    // Insert initial user data if needed
    // Example: create an admin user
    const adminUser = {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        isadmin: true
    };

    await client.query(`
        INSERT INTO users (name, email, password, isadmin)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING;
    `, [adminUser.name, adminUser.email, adminUser.password, adminUser.isadmin]);

    client.release();
    console.log("User data initialized");
};