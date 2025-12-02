import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "./StylesAuthViews";
import {RoundedButton} from "../../components/RoundedButton";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";
import stylesAuthViews from "./StylesAuthViews";
import {useNavigation} from "@react-navigation/native";
import {LoginUserInterface} from "../../../domain/entities/User";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {Image} from "expo-image";
import {styleGameDetails} from "../details/StyleGameDetails";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import {PasswordsDTO} from "../../../domain/entities/UpdatePasswordDTO";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/user-local/SaveUser";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {showCustomToast} from "../../utils/ShowCustomToast";

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
                    try {
                        setShowLoading(true);
                        const response = await loginAuthUseCase(loginValues as LoginUserInterface);
                        await saveUserUseCase({slug: response.slug})
                        await saveTokens(response.access_token, response.refresh_token)
                        await getUserSession()
                        setLoginValues({})
                        setRegisterValues({})
                        setShowLoading(false);
                        navigation.navigate("UserNavigation")
                    } catch {
                        setShowLoading(false);
                    }
                } else {
                    navigation.navigate("UsernameScreen")
                }
            }
        }

        useEffect(() => {
            if (errorMessage !== "") {
                showCustomToast(errorMessage)
                setErrorMessage("")
            }
        }, [errorMessage]);

        return (
            <View style={stylesAuthViews.container}>
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
                            autoFocus={true}
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
                            text={login ? "Sign in" : "Continue"}
                            loading={showLoading}
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
            </View>
        );
    }
