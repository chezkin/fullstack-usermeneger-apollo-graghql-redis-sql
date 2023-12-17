
import { UserInterface as User } from "../types/UserInterface";
import userDal from "../dal/userDal";
import { comparePassword, hashPassword } from "../utils/encryptionUtils";
import { v4 as uuid } from 'uuid';


const authUser = async (email: string, password: string) => {
    const user = await userDal.getUserByEmail(email);
    if (!user)
        throw new Error( "User not found");
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect)
        throw new Error( 'Invalid password');
    return user;
};




const registerUser = async (user: User) => {
    
    const { email, password } = user;    
    const isUserRegisted = await userDal.getUserByEmail(email);
    if (isUserRegisted)
    throw new Error( "user already registed");

const hashedPassword = await hashPassword(password);
user.password = hashedPassword
user.id = uuid();

const newUser = await userDal.registerUser(user);
console.log('user service args:', newUser );
    if (!newUser)
        throw new Error(  "something went wrong");
    return newUser;
};


const getAllUsers = async () => {
    const users = await userDal.getAllUsers();
    if (users.length === 0)
        throw new Error( 'Error: No users found')
    return users;
};

const deleteUser = async (userID: string) => {
    const user = await userDal.deleteUser(userID);
    if (!user)
        throw new Error( 'Error: User not found');
    return user;
};

const updateUser = async (userID: string, user: User) => {
    const updatedUser = await userDal.updateUser(userID, user);
    if (!updatedUser)
        throw new Error( 'Error: User not found');
    return updatedUser;
};


export default {
    registerUser,
    authUser,
    getAllUsers,
    deleteUser,
    updateUser
};

