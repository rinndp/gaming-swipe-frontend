import React, {useEffect, useMemo, useState} from "react";
import {ImageBackground, TouchableOpacity, View} from "react-native";
import {Text} from "../../components/Text";
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
import { useTheme } from "../../theme/ThemeContext";


export function EmailScreen({navigation = useNavigation()}: PropsStackNavigation){
    const { colors, theme } = useTheme();

    const styles = useMemo(() => stylesAuthViews(colors), [colors]);
    const styleDetails = useMemo(() => styleGameDetails(colors), [colors]);

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
        } if (value.toLowerCase().includes("@example.")) {
            setErrorMessage("Example emails are not allowed")
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
        <View style={styles.container}>
            {showLoading ? (
                <>
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                </>
            ):(
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{...styleDetails.goBackIconTouchable, bottom: hp("89%")}}>
                        <Image source={require("../../../../assets/go-back-icon.png")}
                               cachePolicy={"memory-disk"}
                               contentFit={"contain"}
                               style={styleDetails.goBackIcon}/>
                    </TouchableOpacity>
                    <View style={{marginTop: hp("5%"), alignItems:"center"}}>
                        <Image
                            style={{width: wp("9%"), height: hp("7%")}}
                            cachePolicy={"memory-disk"}
                            source={require('../../../../assets/icon-without-bg.png')} />
                        <View style={{marginTop: hp("2%"), gap: hp("2%")}}>
                            <Text style={styles.h2}>{login ? "Introduce your email" : "Create your account"}</Text>
                            <CustomTextInput label={"Email"}
                                             keyboardType={"email-address"}
                                             width={"large"}
                                             secureTextEntry={false}
                                             value={login ?
                                                 loginValues?.email ? loginValues.email : ""
                                                 :
                                                 registerValues?.email ? registerValues.email : ""}
                                             onChangeText={(text) => onChangeDynamic(login, "email", text)}/>
                            <RoundedButton
                                backgroundColor={colors.buttonBackground}
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