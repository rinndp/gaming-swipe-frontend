import {AuthRepository} from "../../../data/repositories/AuthRepository";
import {LoginUserInterface, RegisterUserInterface, RegisterUserInteface} from "../../entities/User";


const  {register} = new AuthRepository();
export const registerUseCase = async (user: RegisterUserInteface) => {
    return await register(user);
}

const  {checkIfEmailRegistered} = new AuthRepository();
export const checkIfEmailRegisteredUseCase = async (email: LoginUserInterface) => {
    return await checkIfEmailRegistered(email);
}

const  {checkIfUsernameRegistered} = new AuthRepository();
export const checkIfUsernameRegisteredUseCase = async (username: RegisterUserInterface) => {
    return await checkIfUsernameRegistered(username);
}