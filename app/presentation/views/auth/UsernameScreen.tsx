import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import stylesAuthViews from "./StylesAuthViews";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {Image} from "expo-image";
import {styleGameDetails} from "../details/StyleGameDetails";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import {showCustomToast} from "../../utils/ShowCustomToast";
import {checkIfUsernameRegisteredUseCase, registerUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {LoginUserInterface, RegisterUserInterface} from "../../../domain/entities/User";
import {loginAuthUseCase} from "../../../domain/usesCases/auth/LoginAuth";
import {saveUserUseCase} from "../../../domain/usesCases/user-local/SaveUser";
import {saveTokens} from "../../../data/sources/local/secure/TokenStorage";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";



export function UsernameScreen({navigation = useNavigation()}: PropsStackNavigation){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showLoading, setShowLoading] = useState(false);

    const {
        registerValues,
        onChangeRegister,
        setLoginValues,
        setRegisterValues,
    } = useUserInfoAuthContext()

    const {getUserSession} = UseUserLocalStorage()


    const validateInput = async (value: string) => {
        if (value === "") {
            setErrorMessage("Username is required")
            return false
        }
        const response = await checkIfUsernameRegisteredUseCase({username: value})
        if (response.error) {
            return false
        }
        return true
    }

    const handleContinue = async (value: string) => {
        if (await validateInput(value || "")) {
            try{
                setShowLoading(true);
                await registerUseCase(registerValues)
                const responseLogin = await loginAuthUseCase(registerValues as LoginUserInterface);
                await saveUserUseCase({slug: responseLogin.slug})
                await saveTokens(responseLogin.access_token, responseLogin.refresh_token)
                await getUserSession()
                setLoginValues({})
                setRegisterValues({})
                setShowLoading(false);
                navigation.navigate("UserNavigation")
            } catch {
                setShowLoading(false);
            }
        }
    }

    useEffect(() => {
        if(errorMessage !== "") {
            showCustomToast(errorMessage)
            setErrorMessage("")
        }
    }, [errorMessage]);

    return (
        <View style={stylesAuthViews.container}>
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
                    <Text style={stylesAuthViews.h2}>{"Choose an username"}</Text>
                    <CustomTextInput label={"Username (Max. 30 characters)"}
                                     keyboardType={"default"}
                                     width={"large"}
                                     autoFocus={true}
                                     maxLenght={30}
                                     secureTextEntry={false}
                                     value={registerValues?.username}
                                     onChangeText={(text) => onChangeRegister("username", text)}/>
                    <RoundedButton
                        backgroundColor={AppColors.buttonBackground}
                        text={"Continue"}
                        loading={showLoading}
                        onPressFromInterface={() => handleContinue(registerValues?.username || "")}/>
                </View>
            </View>
            <Toast/>
        </View >
    );
}