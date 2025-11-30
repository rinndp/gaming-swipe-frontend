import React, {useEffect, useState} from "react";
import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import styles from "./StylesAuthViews";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import {loginViewModel, registerViewModel} from "./ViewModel";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";
import stylesAuthViews from "./StylesAuthViews";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser';
import {LoginUserInterface} from "../../../domain/entities/User";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {GoogleSigninButton} from "@react-native-google-signin/google-signin";
import {Image} from "expo-image";
import {styleGameDetails} from "../details/StyleGameDetails";
import {styleSearch} from "../search/StyleSearch";
import stylesHome from "../home/StyleHome";
import {RootStackParamsList} from "../../../../App";
import {validateEmail} from "../../utils/ValidateEmail";
import {checkIfEmailRegisteredUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import {PasswordsDTO} from "../../../domain/entities/UpdatePasswordDTO";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/userLocal/SaveUser";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";

export function PasswordScreen({navigation = useNavigation()}: PropsStackNavigation) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const {getUserSession} = UseUserLocalStorage()

    const {
        loginValues,
        registerValues,
        onChangeLogin,
        onChangeRegister,
        onChangeDynamic,
        login,
        setLoginValues,
        setRegisterValues
    } = useUserInfoAuthContext()

    const setPasswordsDTOS = (password: string, confirmPassword?: string) => {
        return {password: password, confirmPassword: confirmPassword || ""};
    }


    const validateInput = async (values: PasswordsDTO) => {
        if (values.password === "") {
            setErrorMessage("Password is required")
            return false
        } if (!login) {
            if (values.password.length < 8) {
                setErrorMessage("Password must be at least 8 characters")
                return false
            } if (values.password !== values.confirmPassword) {
                setErrorMessage("Passwords do not match")
                return false
            }
        }
        return true
    }

        const handleContinue = async (values: PasswordsDTO) => {
            if (await validateInput(values)) {
                if (login) {
                    const response = await loginAuthUseCase(loginValues as LoginUserInterface);
                    await saveUserUseCase({slug: response.slug})
                    await saveTokens(response.access_token, response.refresh_token)
                    await getUserSession()
                    setLoginValues({})
                    setRegisterValues({})
                    navigation.navigate("UserNavigation")
                } else {
                    navigation.navigate("UsernameScreen")
                }
            }
        }

        useEffect(() => {
            if (errorMessage !== "") {
                Toast.show({
                    position: "bottom",
                    type: 'error',
                    autoHide: true,
                    visibilityTime: 1400,
                    text1: errorMessage,
                });
                setErrorMessage("")
            }
        }, [errorMessage]);

        return (
            <View style={stylesAuthViews.container}>
                {showLoading ? (
                    <>
                        <ActivtyIndicatorCustom showLoading={showLoading}/>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => navigation.goBack()}
                                          style={{...styleGameDetails.goBackIconTouchable, bottom: hp("90%")}}>
                            <Image source={require("../../../../assets/go-back-icon.png")}
                                   cachePolicy={"memory-disk"}
                                   contentFit={"contain"}
                                   style={styleGameDetails.goBackIcon}/>
                        </TouchableOpacity>
                        <View style={{marginTop: hp("7%"), alignItems: "center"}}>
                            <Image
                                style={{width: wp("9%"), height: hp("5%")}}
                                source={require('../../../../assets/logo.png')}/>
                            <View style={{marginTop: hp("2%"), gap: hp("2%")}}>
                                <Text
                                    style={stylesAuthViews.h2}>{login ? "Introduce your password" : "Choose a password"}</Text>
                                <CustomTextInputPassword
                                    label={login && loginValues?.email ? loginValues.email : "Password"}
                                    keyboardType={"default"}
                                    value={login ? loginValues?.password : registerValues?.password}
                                    onChangeText={(text) => onChangeDynamic(login, "password", text)}/>
                                {!login && (
                                    <>
                                        <Text style={styles.passwordHint}>Password must have at least 8
                                            characters</Text>
                                        <CustomTextInputPassword label={"Confirm password"}
                                                                 keyboardType={"default"}
                                                                 value={registerValues?.confirmPassword}
                                                                 onChangeText={(text) => onChangeRegister("confirmPassword", text)}/>
                                    </>
                                )}
                                <RoundedButton
                                    backgroundColor={AppColors.buttonBackground}
                                    text={"Continue"}
                                    onPressFromInterface={() => handleContinue(
                                        login
                                            ? loginValues?.password
                                                ? setPasswordsDTOS(loginValues?.password)
                                                : setPasswordsDTOS("")
                                            : registerValues?.password && registerValues?.confirmPassword
                                                ? setPasswordsDTOS(registerValues.password, registerValues.confirmPassword)
                                                : setPasswordsDTOS("", "")
                                    )}/>
                            </View>
                        </View>
                        <Toast/>
                    </>
                )}
            </View>
        );
    }
