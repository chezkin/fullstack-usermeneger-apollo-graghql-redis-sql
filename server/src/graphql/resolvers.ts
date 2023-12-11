import { get, set } from "../utils/redis";
import { UserInterface as User } from "../types/UserInterface";
import pubsub from "../pubsub/pubsub";
import {
    cpuData,
    regionData,
    messageData,
    trafficData,
} from "../utils/generator";
import { RedisKey } from "ioredis";

import userService from "../serviec/userService";
import userDal from "../dal/userDal";
import { GraphQLError } from 'graphql';
import { registerUserValidation } from "../utils/validations/userValidation";


const COMPONENTS = {
    CPU: "cpu",
    TRAFFIC: "traffic",
    DISTRIBUTION: "distribution",
    MESSAGES: "messages",
};


const publishRandomData = async (generator: { (): { percentage: number; }; (): any; }, component: any) => {
    const data = generator();
    pubsub.publish(component, { [component]: data });
    await set(component, data);
    return data;
};


const resolvers = {
    Query: {
        users: async () => {
            const users = await userService.getAllUsers();
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
        cpu: {
            subscribe: () => pubsub.asyncIterator(COMPONENTS.CPU)
        },
    }
}

export default resolvers