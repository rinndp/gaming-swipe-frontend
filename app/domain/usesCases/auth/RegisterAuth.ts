import {AuthRepository} from "../../../data/repositories/AuthRepository";
import {LoginUserInterface, RegisterUserInterface} from "../../entities/User";


const  {register} = new AuthRepository();
export const registerUseCase = async (user: RegisterUserInterface) => {
    return await register(user);
}

const  {checkIfEmailRegistered} = new AuthRepository();
export const checkIfEmailRegisteredUseCase = async (email: LoginUserInterface) => {
    return await checkIfEmailRegistered(email);
}

const  {checkIfUsernameRegistered} = new AuthRepository();
export const checkIfUsernameRegisteredUseCase = async (username: RegisterUserInterface, showToast?: boolean) => {
    return await checkIfUsernameRegistered(username, showToast);
}