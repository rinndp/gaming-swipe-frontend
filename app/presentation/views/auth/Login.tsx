import React, {useEffect, useState} from "react";
import {Button, Image, ImageBackground, KeyboardAvoidingView, SafeAreaView, Text, TextInput, View} from "react-native";
import styles from "./StylesAuthViews";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import viewModel from "./ViewModel";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";
import stylesAuthViews from "./StylesAuthViews";
import {useNavigation} from "@react-navigation/native";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession()

export function LoginScreen({navigation = useNavigation(), route}: PropsStackNavigation){

    const {onChangeLogin,
        login,
        user,
        errorMessage,
        setErrorMessage
    } = viewModel.loginViewModel();

    const [showPassword, setShowPassword] = useState(true);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '1072681319890-7fu3f9hbke1cbccqfqb9vj14haqcasbh.apps.googleusercontent.com',
        androidClientId: '1072681319890-o9s9j4eg4kh7i70nttl802tme55rtdra.apps.googleusercontent.com',
        iosClientId: '1072681319890-05jhf95bfa96b5vr3fiu2iveia415r1t.apps.googleusercontent.com',
        scopes: ['openid', 'profile', 'email'],
    })

    // ✅ DEBUG DETALLADO
    useEffect(() => {
        console.log('Response:', response);
        console.log('Request:', request);

        if (response?.type === 'success') {
            const { authentication } = response;
            console.log('Authentication object:', authentication);

            if (authentication?.accessToken) {
                console.log('Access Token received');
                // Aquí puedes hacer la verificación del token
                navigation.replace("UserNavigation");
            } else {
                console.log('No access token in response');
                Toast.show({
                    type: 'error',
                    text1: 'No se recibió token de Google',
                });
            }
        } else if (response?.type === 'error') {
            console.error('Google Auth Error:', response.error);
            console.error('Error details:', response);
            Toast.show({
                type: 'error',
                text1: `Error: ${response.error}`,
            });
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
                        const user = await login()
                        if(user){
                            navigation.replace("UserNavigation")
                        }
                    }}/>
                    <RoundedButton text="Sign in with Google" onPressFromInterface={async () =>{
                        promptAsync().catch((e) => console.error("Error al iniciar sesion: ", e));
                    }}/>
                </View>
                <Toast/>
            </ImageBackground>
        </View >
    );
}