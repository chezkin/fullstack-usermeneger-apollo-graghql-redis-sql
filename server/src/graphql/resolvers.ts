import { getAllUsers, register, login, logout, deleteUser, controlNumberInRedis } from "../redis/redisUsers";
import { UserInterface as User } from "../types/UserInterface";
import pubsub from "../pubsub/pubsub";

import {
    getListDataByKeys,
    setDataByKey,
    getDataByKey,
} from "../redis/redisConfig";

import userService from "../serviec/userService";
import userDal from "../dal/userDal";
import { GraphQLError, valueFromAST } from 'graphql';
import { registerUserValidation } from "../utils/validations/userValidation";


const COMPONENTS = {
    newUser: 'newUser',
    numberOfRegisteredUsers: 'numberOfRegisteredUsers',
    numberOfConnectedUsers: 'numberOfConnectedUsers'
};


// const setDataOnRedis = async (data : any, component: any) => {
//     await set(component, data);
//     return data;
// };


const resolvers = {
    Query: {
        users: async () => {
            const users = await getAllUsers();
            console.log('Query get all users', users);

            return users;
        },
        userByEmail: async (_: any, args: User) => {
            console.log(args);
            const user = await userDal.getUserByEmail(args.email);
            return user;
        },
    },
    Mutation: {
        registerUser: async (_: any, args: { user: User }) => {
            console.log('args.user', args.user);
            const validUser = registerUserValidation(args.user);
            console.log(validUser);

            if (!validUser) {
                throw new GraphQLError('Invalid registration user', { extensions: { http: { status: 500 } } })
            };
            const newUser: User = await userService.registerUser(args.user);
            // שליחת המשתמש החדש שנרשם שלירות פאב 
            pubsub.publish(COMPONENTS.newUser, { newUser: newUser });
            // הוצאת מספר המשתמשים והוספה של אחד 
            const numberOfRegistered = await controlNumberInRedis(COMPONENTS.numberOfRegisteredUsers, true)
            // שליחה של מספר המשתמשים
            pubsub.publish(COMPONENTS.numberOfRegisteredUsers, numberOfRegistered);
            return newUser;
        },
        updateUser: async (_: any, user: User) => {
            const updatedUser = await userService.updateUser(user.id!, user);
            return updatedUser;
        },
        loginUser: async (_: any, user: User) => {
            const updatedUser = await userService.authUser(user.id!, user.email);
            // הוצאת מספר המשתמשים הרשומים והוספה של אחד 
            const numberOfConnected = await controlNumberInRedis(COMPONENTS.numberOfConnectedUsers, true)
            // שליחה של מספר המשתמשים
            pubsub.publish(COMPONENTS.numberOfConnectedUsers, numberOfConnected);
            return updatedUser;
        },
        deleteUser: async (_: any, user: User) => {
            const deletedUser = await userService.deleteUser(user.id!);
            return deletedUser;
        },
    },
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator([COMPONENTS.newUser], { pattern: true })
        },
        numberOfConnectedUsers: {
            subscribe: () => pubsub.asyncIterator([COMPONENTS.numberOfConnectedUsers], { pattern: true })
        },
    }
}

export default resolvers