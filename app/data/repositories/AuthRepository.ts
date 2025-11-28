
import {AuthRepositoryInterface} from "../../domain/repositories/AuthRepositoryInterface";
import {LoggedUserInterface, LoginUserInterface, UserInterface} from "../../domain/entities/User";
import {ApiDeliveryResponse} from "../sources/remote/models/ApiDeliveryResponse";
import {Axios, AxiosError} from "axios";
import {ApiDelivery} from "../sources/remote/api/ApiDelivery";
import Toast from "react-native-toast-message";

export class AuthRepository implements AuthRepositoryInterface {
    async register(user: UserInterface): Promise<ApiDeliveryResponse> {
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
            Toast.show({
                type: 'error',
                text1: e.response?.data.error,
            })
            return Promise.reject(e.response?.data.error);
        }
    }

    async checkIfEmailRegistered(email: LoginUserInterface): Promise<ApiDeliveryResponse> {
        try {
            const response = await ApiDelivery.post("users/check-if-registered/", email);
            return Promise.resolve(response.data);
        } catch (error) {
            let e = (error as AxiosError <{error: string}>)
            Toast.show({
                position: "bottom",
                type: 'error',
                autoHide: true,
                visibilityTime: 1400,
                text1: e.response?.data.error,
            })
            return Promise.reject(e.response?.data);
        }
    }
}