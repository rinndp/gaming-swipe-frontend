import {useState} from "react";
import {registerUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {RegisterUserInterface} from "../../../domain/entities/User";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/user-local/SaveUser";
import Toast from "react-native-toast-message";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";

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
            console.log('User not found, registering...');
            await registerUseCase(userData);
            return await loginAuthUseCase(userData);;
        }
    };

    const handleGoogleLogin = async (googleAccessToken: string, navigation: any)  => {
        try {
            setShowLoading(true);
            const userFetched = await fetchUserInfo(googleAccessToken);
            const response = await handleUserAuth(userFetched);

            await saveUserUseCase({ slug: response.slug });
            await saveTokens(response.access_token, response.refresh_token);
            await getUserSession();

            navigation.navigate('UserNavigation');
        } catch (error) {
            console.log('Google login failed:', error);
            Toast.show({
                type: 'error',
                text1: 'Error en el login con Google',
            });
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