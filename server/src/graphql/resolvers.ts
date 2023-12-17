import { getAllUsers, register, login, logout, deleteUser } from "../redis/redisUsers";
import { UserInterface as User } from "../types/UserInterface";
import pubsub from "../pubsub/pubsub";

import { RedisKey } from "ioredis";

import userService from "../serviec/userService";
import userDal from "../dal/userDal";
import { GraphQLError } from 'graphql';
import { registerUserValidation } from "../utils/validations/userValidation";


const COMPONENTS = {
    users: 'user:*:*'
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
        registerUser: async (_: any, args:{user : User}) => {
            console.log('args.user',args.user);
            const validUser = registerUserValidation(args.user);
            console.log(validUser);
            
            if (!validUser) {
                throw new GraphQLError('Invalid registration user',{extensions:{http:{status: 500}}})};
            const newUser : User = await userService.registerUser(args.user);
            const inRedis = await register(newUser)
            return inRedis;
        },
        updateUser: async (_: any, user: User) => {
            const updatedUser = await userService.updateUser(user.id!, user);
            return updatedUser;
        },
        deleteUser: async (_: any, user: User) => {
            const deletedUser = await userService.deleteUser(user.id!);
            return deletedUser;
        },
    },
    Subscription: {
        users: {
            subscribe: () => pubsub.asyncIterator(COMPONENTS.users)
        },
    }
}

export default resolvers