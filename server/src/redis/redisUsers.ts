import { RedisKey } from "ioredis";
import { redisConnect } from "./redisConfig";
import {
    getListDataByKeys,
    setDataByKey,
    getDataByKey,
} from "./redisConfig";
import { UserInterface } from "../types/UserInterface";
import userService from "../serviec/userService";

const controlNumberInRedis = async (key: string, parameter: boolean) => {
    type NumberRedis = {
        number: number;
    }
    try {
        const number: NumberRedis = { number: 0 }
        const rasNumber = await getDataByKey(key)
        if (parameter) {
            if (rasNumber) {
                const num: NumberRedis = JSON.parse(rasNumber)
                number.number = num.number + 1
            }
            await setDataByKey(key, number)
        } else if (!parameter) {
            if (rasNumber) {
                const num: NumberRedis = JSON.parse(rasNumber)
                num.number > 0 ? number.number = num.number - 1 : number.number = 0
            }
        }
        return number
    } catch (error) {
        console.log(error);
    }
}


const getAllUsers = async () => {
    try {
        const users = await getListDataByKeys('user:*:*')
        return users;
    } catch (e) {
        console.log(`Erorr:`, e);
        return null
    }
};

const setAllUsers = async () => {
    const users: UserInterface[] = await userService.getAllUsers()
    await Promise.all(users.map(async (user) => {
        const key: RedisKey = `user:${user.id}:${user.isadmin}`
        try {
            await redisConnect.set(key, JSON.stringify(user));
            console.log('users inserted to redis');

            return true;
        } catch (e) {
            return false;
        }
    }));

    return users;
};

const register = async (user: UserInterface) => {
    const key: RedisKey = `user:${user.id}:${user.isadmin}`
    try {
        const req = await redisConnect.set(key, JSON.stringify(user));
        return user;
    } catch (e) {
        return false;
    }
};

const deleteUser = async (user: UserInterface) => {
    const key: RedisKey = `user:${user.id}:${user.isadmin}`
    try {
        const del = await redisConnect.del(key);
        if (del === 1) { return true }
        else { return false }

    } catch (e) {
        return false;
    }
};

const login = async (id: string) => {
    const key: RedisKey = `user:${id}:*`
    try {
        const userData = await redisConnect.get(key);
        if (userData) {
            const user: UserInterface = JSON.parse(userData);
            const newKey: RedisKey = `user:${user.id}:${user.isadmin}`
            const loginUser = { ...user, login: true }
            await redisConnect.set(newKey, JSON.stringify(loginUser));
            console.log('user', loginUser);
            return user
        } else {
            console.log('user not found');
            return false
        }
    } catch (e) {
        return false;
    }
};
const logout = async (id: string) => {
    const key: RedisKey = `user:${id}:*`
    try {
        const userData = await redisConnect.get(key);
        if (userData) {
            const user: UserInterface = JSON.parse(userData);
            const newKey: RedisKey = `user:${user.id}:${user.isadmin}`
            const loginUser = { ...user, login: false }
            await redisConnect.set(newKey, JSON.stringify(loginUser));
            console.log('user', loginUser);
            return user
        } else {
            console.log('user not found');
            return false
        }
    } catch (e) {
        return false;
    }
};

export {
    getAllUsers,
    register,
    login,
    logout,
    deleteUser,
    setAllUsers,
    controlNumberInRedis,
}