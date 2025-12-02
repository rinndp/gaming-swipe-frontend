import {ApiDeliveryResponse} from "../../data/sources/remote/models/ApiDeliveryResponse";
import {GetUserInterface, UpdateUserDTO, RegisterUserInteface} from "../entities/User";
import {PasswordsDTO} from "../entities/UpdatePasswordDTO";


export interface AccountRepositoryInterface {
    getUser: (slug: string) => Promise<GetUserInterface>;
    updateUser: (slug: string, data: UpdateUserDTO | FormData) => Promise<ApiDeliveryResponse>
    updateUserPassword: (slug: string, data: PasswordsDTO) => Promise<ApiDeliveryResponse>
}