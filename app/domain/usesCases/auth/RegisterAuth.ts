import {AuthRepository} from "../../../data/repositories/AuthRepository";
import {LoginUserInterface, UserInterface} from "../../entities/User";


const  {register} = new AuthRepository();
export const registerUseCase = async (user: UserInterface) => {
    return await register(user);
}

const  {checkIfEmailRegistered} = new AuthRepository();
export const checkIfEmailRegisteredUseCase = async (email: LoginUserInterface) => {
    return await checkIfEmailRegistered(email);
}