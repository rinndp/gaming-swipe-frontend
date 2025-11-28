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
import {useUserGamesContext} from "../../provider/GameProvider";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import {underDampedSpringCalculations} from "react-native-reanimated/lib/typescript/animation/spring";

type EmailScreenRouteProp = RouteProp<RootStackParamsList, "EmailScreen">;


export function EmailScreen({navigation = useNavigation()}: PropsStackNavigation){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showLoading, setShowLoading] = useState(false);
    const route = useRoute<EmailScreenRouteProp>();
    const {login} = route.params;

    const {loginValues, registerValues, onChangeLogin, onChangeRegister} = useUserInfoAuthContext()

    const onChangeDynamic = (login: boolean, key: string, value: string) => {
        if (login) {
            onChangeLogin(key, value);
        } else {
            onChangeRegister(key, value);
        }
    }

    const validateInput = async (value: string) => {
        if (value === "") {
            setErrorMessage("Email is required")
            return false
        } if (!validateEmail(value)) {
            setErrorMessage("Email is not valid")
            return false
        }
        if (!login) {
            const response = await checkIfEmailRegisteredUseCase({email: value});
            if (response.error) {
                return false
            }
        }
        return true;
    }

    const handleContinue = async (value: string | undefined) => {
        if (await validateInput(value || "")) {
            navigation.navigate("PasswordScreen", {login:login});
        }
    }

    useEffect(() => {
        if(errorMessage !== "") {
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
            ):(
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{...styleGameDetails.goBackIconTouchable, bottom: hp("90%")}}>
                        <Image source={require("../../../../assets/go-back-icon.png")}
                               cachePolicy={"memory-disk"}
                               contentFit={"contain"}
                               style={styleGameDetails.goBackIcon}/>
                    </TouchableOpacity>
                    <View style={{marginTop: hp("7%"), alignItems:"center"}}>
                        <Image
                            style={{width: wp("9%"), height: hp("5%")}}
                            source={require('../../../../assets/logo.png')} />
                        <View style={{marginTop: hp("2%"), gap: hp("2%")}}>
                            <Text style={stylesAuthViews.h2}>{login ? "Introduce your email" : "Create your account"}</Text>
                            <CustomTextInput label={"Email"}
                                             keyboardType={"email-address"}
                                             secureTextEntry={false}
                                             onChangeText={(text) => onChangeDynamic(login, "email", text)}/>
                            <RoundedButton
                                backgroundColor={AppColors.buttonBackground}
                                text={"Continue"}
                               onPressFromInterface={() => handleContinue(
                                   login ?
                                       (loginValues ? loginValues.email : "")
                                   :
                                       (registerValues ? registerValues.email : "")
                               )}/>
                        </View>
                    </View>
                    <Toast/>
                </>
            )}
        </View >
    );
}