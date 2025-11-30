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



export function UsernameScreen({navigation = useNavigation()}: PropsStackNavigation){
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showLoading, setShowLoading] = useState(false);

    const {registerValues, onChangeRegister} = useUserInfoAuthContext()

    const validateInput = async (value: string) => {
        if (value === "") {
            setErrorMessage("Username is required")
            return false
        }
        return true
    }

    const handleContinue = async (value: string | undefined) => {
        if (await validateInput(value || "")) {
            navigation.goBack();
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
                            <Text style={stylesAuthViews.h2}>{"Choose an username"}</Text>
                            <CustomTextInput label={"Username"}
                                             keyboardType={"default"}
                                             secureTextEntry={false}
                                             value={registerValues?.username}
                                             onChangeText={(text) => onChangeRegister("username", text)}/>
                            <RoundedButton
                                backgroundColor={AppColors.buttonBackground}
                                text={"Continue"}
                                onPressFromInterface={() => handleContinue(registerValues?.username)}/>
                        </View>
                    </View>
                    <Toast/>
                </>
            )}
        </View >
    );
}