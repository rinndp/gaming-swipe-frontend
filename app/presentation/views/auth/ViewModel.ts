import {useState} from "react";
import {registerUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {LoginUserInterface, UserInterface} from "../../../domain/entities/User";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/userLocal/SaveUser";
import Toast from "react-native-toast-message";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";
import {validateEmail} from "../../utils/ValidateEmail";
import {AxiosError} from "axios";

export const loginViewModel= () => {

    const [errorMessageLogin, setErrorMessageLogin] = useState<string>("")
    const [showLoading, setShowLoading] = useState<boolean>(false)
    const {user, getUserSession} = UseUserLocalStorage()

    const[loginValues, setLoginvalue] = useState({
        email: "",
        password: "",
    })


    const onChangeLogin=(property:string, value:any)=>{
        setErrorMessageLogin("")
        setLoginvalue({
            ...loginValues,[property]:value})
    }

    const validateFormLogin = () =>{
        if (loginValues.email === ""){
            setErrorMessageLogin("Email is required");
            return false;
        } if (loginValues.password === ""){
            setErrorMessageLogin("Password is required");
            return false;
        }
        return true;
    }

    const login= async  (user: LoginUserInterface) => {
        if (validateFormLogin()){
            const response = await loginAuthUseCase(user);
            await saveUserUseCase({slug: response.slug})
            await saveTokens(response.access_token, response.refresh_token)
            await getUserSession()
            return response
        }
    }

    const fetchUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const userInfo = await response.json();
            const user: UserInterface = {
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
        onChangeLogin,
        login,
        validateFormLogin,
        user,
        errorMessageLogin,
        setErrorMessageLogin,
        getUserSession,
        fetchUserInfo,
        handleGoogleLogin,
        showLoading,
    }
}


export const registerViewModel= () => {

    const [errorMessageRegister, setErrorMessageRegister] = useState<string>("")

    const [registerValues, setRegisterValue] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const register = async  () => {
        if(validateFormRegister()){
            const user: UserInterface = {
                email: registerValues.email,
                username: registerValues.username,
                password: registerValues.password,
            }
            const response = await registerUseCase(user)
            Toast.show({
                type: 'success',
                text1: response.message,
            })
        }
    }

    const onChangeRegister=(property:string, value:any)=>{
        setRegisterValue({
            ...registerValues, [property]:value
        })
    }

    const validateFormRegister = () => {
       if (registerValues.email === "") {
            setErrorMessageRegister("Email is required")
            return false
        } if (!validateEmail(registerValues.email)) {
            setErrorMessageRegister("Email is not valid")
            return false
        } if (registerValues.password === "") {
            setErrorMessageRegister("Password is required")
            return false
        } if (registerValues.password.length < 8) {
            setErrorMessageRegister("Password must have at least 8 characters")
            return false
        } if (registerValues.password !== registerValues.confirmPassword) {
            setErrorMessageRegister("The passwords do not match")
            return false
        }  if (registerValues.username === "") {
            setErrorMessageRegister("Username is required");
            return false
        }
        return true
    }

    return {
        registerValues,
        onChangeRegister,
        register,
        errorMessageRegister,
        setErrorMessageRegister,
        validateFormRegister,
    }
}

export default {loginViewModel, registerViewModel}