import {useState} from "react";
import {checkIfEmailRegisteredUseCase, checkIfUsernameRegisteredUseCase, registerUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
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
    const [firstTime, setFirstTime] = useState<boolean>(false)

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

            let username = userInfo.name;
            let isAvailable = false;
            let attempts = 0;

            while (!isAvailable && attempts < 10) {
                try {
                    await checkIfUsernameRegisteredUseCase({username}, false);
                    isAvailable = true;
                } catch (error) {
                    username = `${userInfo.name}${Math.floor(Math.random() * 1000)}`;
                    attempts++;
                }
            }

            if (!isAvailable) {
                throw new Error('Could not generate unique username');
            }

            const user: RegisterUserInterface = {
                email: userInfo.email,
                username: username,
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
            return await loginAuthUseCase(userData, false);;
        } catch (loginError) {
            try {
                await registerUseCase(userData);
                setFirstTime(true);
                return await loginAuthUseCase(userData);;
            } catch (registerError) {
                const response = await checkIfEmailRegisteredUseCase({email: userData.email});
                if (response.error) {
                    showCustomToast("Email already registered")
                    throw registerError;
                } else {
                    showCustomToast("Error while registering user");
                    throw registerError; 

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
                if (firstTime) {
                    navigation.replace('TutorialScreen', {firstTime: true});
                } else {
                    navigation.replace('UserNavigation');
                }
            }
        } catch (error) {
            throw error;
        } finally {
            setShowLoading(false);
        }
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