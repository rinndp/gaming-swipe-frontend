import {UserLocalRepository} from "../../../data/repositories/UserLocalRepository";
import {LoggedUserInterface} from "../../entities/User";


const {save} = new UserLocalRepository();

export const saveUserUseCase = async (user: LoggedUserInterface) => {
    return await save(user);
}
