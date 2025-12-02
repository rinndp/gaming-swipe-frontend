import {UserLocalRepository} from "../../../data/repositories/UserLocalRepository";
import {LoggedUserInterface} from "../../entities/User";
import {useNavigation} from "@react-navigation/native";


const {remove} = new UserLocalRepository()

export const removeUserUseCase = async () => {
    return await remove()
}