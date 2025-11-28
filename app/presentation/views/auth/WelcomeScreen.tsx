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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {GoogleSigninButton} from "@react-native-google-signin/google-signin";
import {Image} from "expo-image";
import {styleGameDetails} from "../details/StyleGameDetails";
import {styleSearch} from "../search/StyleSearch";

export const googleLogo = require("../../../../assets/google-logo.png")


WebBrowser.maybeCompleteAuthSession()

export function WelcomeScreen({navigation = useNavigation(), route}: PropsStackNavigation){

    const {onChangeLogin,
        handleGoogleLogin,
        showLoading,
    } = loginViewModel();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '1072681319890-o9s9j4eg4kh7i70nttl802tme55rtdra.apps.googleusercontent.com',
        iosClientId: '1072681319890-05jhf95bfa96b5vr3fiu2iveia415r1t.apps.googleusercontent.com',
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

    return (
        <View style={stylesAuthViews.container}>
                {showLoading ? (
                    <>
                        <ActivtyIndicatorCustom showLoading={showLoading}/>
                    </>
                ):(
                    <>

                        <View style={styles.welcomeTextContainer}>
                            <Text style={{...styles.welcomeText, fontSize:wp("7%")}}>Welcome to</Text>
                            <Text style={styles.welcomeText}>GamingSwipe</Text>
                            <View style={{flexDirection:"row", gap:wp("2%"), marginTop:hp("2%"), alignItems:"center"}}>
                                <Image
                                    style={{width: wp("9%"), height: hp("5%")}}
                                    source={require('../../../../assets/logo.png')} />
                                <Text style={{color:AppColors.white}}>+</Text>
                                <Image
                                    style={{width: wp("12%"), height: hp("5%"), tintColor: AppColors.white}}
                                    source={require('../../../../assets/igdb-logo.webp')} />
                            </View>
                        </View>
                        <View style={styles.formButtonContainer}>
                            <RoundedButton
                                width={wp("98%")}
                                logo={googleLogo}
                                backgroundColor={AppColors.backgroundColor}
                                text="Sign in with Google" onPressFromInterface={async () =>{
                                promptAsync().catch((e) => console.error("Error al iniciar sesion: ", e));
                            }}/>
                            <RoundedButton
                                width={wp("98%")}
                                backgroundColor={AppColors.buttonBackground}
                                text="Sign In" onPressFromInterface={() => navigation.navigate("EmailScreen", {login: true})}/>
                            <RoundedButton
                                width={wp("98%")}
                                backgroundColor={AppColors.secondaryColor}
                                text="Create an account" onPressFromInterface={() => navigation.navigate("EmailScreen", {login: false})}/>
                        </View>
                        <Toast/>
                    </>
                )}
        </View >
    );
}