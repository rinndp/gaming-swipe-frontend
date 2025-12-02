import React, {useEffect, useState} from "react";
import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import stylesAuthViews from "./StylesAuthViews";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {Image} from "expo-image";
import {styleGameDetails} from "../details/StyleGameDetails";
import {validateEmail} from "../../utils/ValidateEmail";
import {checkIfEmailRegisteredUseCase} from "../../../domain/usesCases/auth/RegisterAuth";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import {showCustomToast} from "../../utils/ShowCustomToast";


export function EmailScreen({navigation = useNavigation()}: PropsStackNavigation){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showLoading, setShowLoading] = useState(false);

    const {loginValues, registerValues, onChangeLogin, onChangeRegister, onChangeDynamic, login} = useUserInfoAuthContext()

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
            navigation.navigate("PasswordScreen");
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
                                             width={"large"}
                                             autoFocus={true}
                                             secureTextEntry={false}
                                             value={login ?
                                                 loginValues?.email ? loginValues.email : ""
                                                 :
                                                 registerValues?.email ? registerValues.email : ""}
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