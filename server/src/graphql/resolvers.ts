import { get, set } from "../utils/redis";
import { UserInterface as User } from "../types/UserInterface";
import pubsub from "../pubsub/pubsub";

import { RedisKey } from "ioredis";

import userService from "../serviec/userService";
import userDal from "../dal/userDal";
import { GraphQLError } from 'graphql';
import { registerUserValidation } from "../utils/validations/userValidation";


const COMPONENTS = {
    users: 'users'
};


const setDataOnRedis = async (data : any, component: any) => {
    await set(component, data);
    return data;
};


const resolvers = {
    Query: {
        users: async () => {
            const users = await userService.getAllUsers();
            await setDataOnRedis(users, COMPONENTS.users)
            return users;
        },
        userByEmail: async (_: any, args: User) => {
            console.log(args);
            const user = await userDal.getUserByEmail(args.email);
            return user;
        },
    },
    Mutation: {
        registerUser: async (_: any, args: User) => {
            console.log(args);
            
            const validUser = registerUserValidation(args);
            console.log(validUser);
            
            if (!validUser) {
                throw new GraphQLError('Invalid registration user',{extensions:{http:{status: 500}}})};
            const newUser = await userService.registerUser(args);
            return newUser;
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