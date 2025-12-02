
import {AuthRepositoryInterface} from "../../domain/repositories/AuthRepositoryInterface";
import {
    LoggedUserInterface,
    LoginUserInterface,
    RegisterUserInterface,
    RegisterUserInteface
} from "../../domain/entities/User";
import {ApiDeliveryResponse} from "../sources/remote/models/ApiDeliveryResponse";
import {Axios, AxiosError} from "axios";
import {ApiDelivery} from "../sources/remote/api/ApiDelivery";
import Toast from "react-native-toast-message";
import {showCustomToast} from "../../presentation/utils/ShowCustomToast";

export class AuthRepository implements AuthRepositoryInterface {
    async register(user: RegisterUserInteface): Promise<ApiDeliveryResponse> {
        try {
            const response = await ApiDelivery.post("users/create", user);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError <{error: string}>)
            console.log(e.response?.data.error);
            Toast.show({
                type: 'error',
                text1: e.response?.data.error,
            })
            return Promise.reject(e.response?.data.error);
        }
    }

    async login(user: LoginUserInterface): Promise<LoggedUserInterface> {
        try {
            const response = await ApiDelivery.post("users/login", user);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError <{error:string}>)
            console.log(e.response?.data.error);
            showCustomToast(e.response?.data.error)
            return Promise.reject(e.response?.data.error);
        }
    }

    async checkIfEmailRegistered(email: LoginUserInterface): Promise<ApiDeliveryResponse> {
        try {
            const response = await ApiDelivery.post("users/check-if-registered/", email);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError <{error: string}>)
            showCustomToast(e.response?.data.error)
            return Promise.reject(e.response?.data);
        }
    }

    async checkIfUsernameRegistered(username: RegisterUserInterface): Promise<ApiDeliveryResponse> {
        try {
            const response = await ApiDelivery.post("users/check-if-username-registered/", username);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError <{error: string}>)
            showCustomToast(e.response?.data.error)
            return Promise.reject(e.response?.data);
        }
    }
}