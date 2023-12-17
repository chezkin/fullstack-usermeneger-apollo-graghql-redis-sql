import postgresPool from './pgConnect'

export const connectToPostgres = async () => {
    const connect = await postgresPool.connect()
    console.log("Connecting to postgres");
    connect.release();
};

export const initializeUserData = async () => {
    const client = await postgresPool.connect();
    console.log("Initializing User data");

    // Insert initial user data if needed
    // Example: create an admin user
    const adminUser = {
        firstname: 'admin',
        lastname: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        isadmin: true
    };

    await client.query(`
        INSERT INTO users (firstname, lastname, email, password, isadmin)
        VALUES ($1, $2, $3, $4, $5)
        
    `, [adminUser.firstname, adminUser.lastname, adminUser.email, adminUser.password, adminUser.isadmin]);
    
    client.release();
    console.log("User data initialized");
};