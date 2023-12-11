import { GraphQLError } from 'graphql';
import postgresPool from '../config/pgConnect'
import { UserInterface as User } from '../types/UserInterface';

const getUserByEmail = async (email: string) => {
    let client;
    try {
        client = await postgresPool.connect();        
        try {
            const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [email]);            
            return rows[0];
        } catch (queryError) {  
            throw new GraphQLError('Something went wrong, stack: 1',
            {extensions:{code: 'INTERNAL_SERVER_ERROR',http:{status: 500}}});          
        } finally {
            client.release();
        };
    } catch (connectionError) {    
        if (connectionError instanceof GraphQLError) throw connectionError;      
        throw new GraphQLError('Error connecting to the database, stack: 1',
        {extensions:{code: 'INTERNAL_SERVER_ERROR',http:{status: 500}}});
    };
};

const registerUser = async (user: User) => {
    let client;
    try {
        client = await postgresPool.connect();
        try {
            const { rows } = await client.query(`INSERT INTO users (id, name, email, password, isadmin) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [user.id, user.name, user.email, user.password, user.isadmin]);
            return rows[0];
        } catch (queryError) {
            throw new GraphQLError( `${queryError} 'Something went wrong, stack: 1'` ,{extensions:{code: 'INTERNAL_SERVER_ERROR',http:{status: 500}}});
        } finally {
            client.release();
        };
    } catch (connectionError) {
        if (connectionError instanceof GraphQLError) throw connectionError;
        throw new GraphQLError('Error connecting to the database, stack: 1',{extensions:{code: 'INTERNAL_SERVER_ERROR',http:{status: 500}}});
    };
};

const getAllUsers = async () => {
    let client;
    try {
        client = await postgresPool.connect();
        try {
            const { rows } = await client.query("SELECT * FROM users");
            return rows;
        } catch (queryError) {
            throw new GraphQLError(`Something went wrong, stack: 1 - ${queryError}`
            ,{extensions:{code: queryError ,http:{status: 500}}});
        } finally {
            client.release();
        };
    } catch (connectionError) {
        if (connectionError instanceof GraphQLError) throw connectionError;
        throw new GraphQLError('Error connecting to the database, stack: 1' ,{extensions:{code: connectionError,http:{status: 500}}});
    };
};

const deleteUser = async (userID: string) => {
    let client;
    try {
        client = await postgresPool.connect();
        try {
            const { rows } = await client.query("DELETE FROM users WHERE id = $1 RETURNING *", [userID]);
            return rows[0];
        } catch (queryError) {
            throw new GraphQLError(`Something went wrong, stack: 1 - ${queryError}`
            ,{extensions:{code: queryError ,http:{status: 500}}});
        } finally {
            client.release();
        };
    } catch (connectionError) {
        if (connectionError instanceof GraphQLError) throw connectionError;
        throw new GraphQLError('Error connecting to the database, stack: 1' ,{extensions:{code: connectionError,http:{status: 500}}});
    };
};

const updateUser = async (userID: string, user: User) => {
    let client;
    try {
        client = await postgresPool.connect();
        try {
            const { rows } = await client.query("UPDATE users SET name = $1, email = $2, password = $3, isadmin = $4 WHERE id = $5 RETURNING *", [user.name, user.email, user.password, user.isadmin, userID]);
            return rows[0];
        } catch (queryError) {
            throw new GraphQLError(`Something went wrong, stack: 1 - ${queryError}`
            ,{extensions:{code: queryError ,http:{status: 500}}});        } finally {
            client.release();
        };
    } catch (connectionError) {
        if (connectionError instanceof GraphQLError) throw connectionError;
        throw new GraphQLError('Error connecting to the database, stack: 1' ,{extensions:{code: connectionError,http:{status: 500}}});
    };
};


export default { getUserByEmail, registerUser, getAllUsers, deleteUser, updateUser };
