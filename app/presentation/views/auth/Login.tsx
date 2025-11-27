import React, {useEffect} from "react";
import {ImageBackground, Text, View} from "react-native";
import styles from "./StylesAuthViews";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import {loginViewModel} from "./ViewModel";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";
import stylesAuthViews from "./StylesAuthViews";
import {useNavigation} from "@react-navigation/native";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser';
import {LoginUserInterface} from "../../../domain/entities/User";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";

WebBrowser.maybeCompleteAuthSession()

export function LoginScreen({navigation = useNavigation(), route}: PropsStackNavigation){

    const {onChangeLogin,
        login,
        user,
        errorMessage,
        setErrorMessage,
        loginValues,
        handleGoogleLogin,
        showLoading,
    } = loginViewModel();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '1072681319890-o9s9j4eg4kh7i70nttl802tme55rtdra.apps.googleusercontent.com',

    })

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            console.log('Authentication object:', authentication);
            if (authentication?.accessToken) {
                handleGoogleLogin(authentication.accessToken, navigation);
            } else {
                console.log('No access token in response');
            }
        } else if (response?.type === 'error') {
            console.log('Google Auth Error:', response.error);
            console.log('Error details:', response);
        }
    }, [response]);

    useEffect(() => {
        if(errorMessage !== "") {
            Toast.show({
                type: 'error',
                text1: errorMessage,
            });
            setErrorMessage("")
        }
    }, [errorMessage]);

    return (
        <View style={stylesAuthViews.container}>
            <ImageBackground source={require("../../../../assets/background.png")}
                             style={{width: '100%', height: '100%'}}>
                {showLoading ? (
                    <>
                        <ActivtyIndicatorCustom showLoading={showLoading}/>
                    </>
                ):(
                    <>
                        <View style={styles.formContainer}>
                            <Text style={styles.titleLogin}>Welcome Back</Text>

                            <View style={styles.formInputContainer}>
                                <CustomTextInput label={"Email"}
                                                 keyboardType={"default"}
                                                 secureTextEntry={false}
                                                 onChangeText={(text) => onChangeLogin('email', text)}></CustomTextInput>

                                <CustomTextInputPassword label={"Password"}
                                                         keyboardType={"default"}
                                                         onChangeText={(text) => onChangeLogin('password', text)}></CustomTextInputPassword>
                            </View>

                        </View>
                        <View style={styles.formButtonContainer}>
                            <RoundedButton text="Sign in" onPressFromInterface={async () =>{
                                const user = await login(loginValues as LoginUserInterface)
                                if(user){
                                    navigation.replace("UserNavigation")
                                }
                            }}/>
                            <RoundedButton text="Sign in with Google" onPressFromInterface={async () =>{
                                promptAsync().catch((e) => console.error("Error al iniciar sesion: ", e));
                            }}/>
                        </View>
                        <Toast/>
                    </>
                )}
            </ImageBackground>
        </View >
    );
}