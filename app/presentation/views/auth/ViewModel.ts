import {useState} from "react";
import {checkIfEmailRegisteredUseCase, registerUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {RegisterUserInterface} from "../../../domain/entities/User";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/user-local/SaveUser";
import Toast from "react-native-toast-message";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";
import { showCustomToast } from "../../utils/ShowCustomToast";


export const welcomeViewModel= () => {

    const [showLoading, setShowLoading] = useState<boolean>(false)
    const {user, getUserSession} = UseUserLocalStorage()

    const[loginValues, setLoginvalue] = useState({
        email: "",
        password: "",
    })

    const fetchUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const userInfo = await response.json();
            const user: RegisterUserInterface = {
                email: userInfo.email,
                username: userInfo.name,
                google_id: userInfo.id,
            }
            return Promise.resolve(user);

        } catch (error) {
            console.error('Error fetching user info:', error);
            return Promise.reject(error);
        }
    };

    const handleUserAuth = async (userData: any) => {
        try {
            return await loginAuthUseCase(userData);;
        } catch (loginError) {
            try {
                await registerUseCase(userData);
                return await loginAuthUseCase(userData);;
            } catch (registerError) {
                const response = await checkIfEmailRegisteredUseCase({email: userData.email});
                if (response.error) {
                    showCustomToast("Email already registered")
                } else {
                    showCustomToast("Error while registering user")
                    throw registerError; // ✅ Lanzar error original

                }
            }
        }
    };

    const handleGoogleLogin = async (googleAccessToken: string, navigation: any)  => {
        try {
            setShowLoading(true);
            const userFetched = await fetchUserInfo(googleAccessToken);
            const response = await handleUserAuth(userFetched);
            if (response) {
                await saveUserUseCase({ slug: response.slug });
                await saveTokens(response.access_token, response.refresh_token);
                await getUserSession();
                navigation.navigate('UserNavigation');
            }
        } catch (error) {
            showCustomToast("Error while signing in with Google")
            throw error;
        }
        setShowLoading(false);
    }


    return{
        loginValues,
        user,
        getUserSession,
        fetchUserInfo,
        handleGoogleLogin,
        showLoading,
    }
}

export default {loginViewModel: welcomeViewModel}