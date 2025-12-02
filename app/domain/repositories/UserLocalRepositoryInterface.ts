import {LoggedUserInterface, RegisterUserInteface} from "../entities/User";
import {ApiDeliveryResponse} from "../../data/sources/remote/models/ApiDeliveryResponse";

export interface UserLocalRepositoryInterface {
    save(user: LoggedUserInterface): Promise<void>;
    getUser(): Promise<LoggedUserInterface>;
    remove(): Promise<void>;
}