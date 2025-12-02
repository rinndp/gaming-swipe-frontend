import {Platform} from "react-native";
import {LoggedUserInterface, LoginUserInterface, RegisterUserInteface} from "../entities/User";
import {ApiDeliveryResponse} from "../../data/sources/remote/models/ApiDeliveryResponse";

export interface AuthRepositoryInterface {
    register: (user: RegisterUserInteface) => Promise<ApiDeliveryResponse>;
    login: (user: LoginUserInterface) => Promise<LoggedUserInterface>;
}