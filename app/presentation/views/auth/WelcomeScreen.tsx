import React, {useEffect} from "react";
import {ImageBackground, Text, View} from "react-native";
import styles from "./StylesAuthViews";
import {RoundedButton} from "../../components/RoundedButton";
import {welcomeViewModel} from "./ViewModel";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import Toast from "react-native-toast-message";
import stylesAuthViews from "./StylesAuthViews";
import {useNavigation} from "@react-navigation/native";
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser';
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import {Image} from "expo-image";
import {useUserInfoAuthContext} from "../../provider/UserInfoAuthProvider";
import Constants from 'expo-constants';


export const googleLogo = require("../../../../assets/google-logo.png")


WebBrowser.maybeCompleteAuthSession()

export function WelcomeScreen({navigation = useNavigation(), route}: PropsStackNavigation){

    const {
        handleGoogleLogin,
        showLoading,
    } = welcomeViewModel();

    const {setLogin} = useUserInfoAuthContext()

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: Constants.expoConfig?.extra?.androidClientId,
        iosClientId: Constants.expoConfig?.extra?.iosClientId,
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
                                text="Sign In" onPressFromInterface={() => {
                                    navigation.navigate("EmailScreen")
                                    setLogin(true)
                                }}/>
                            <RoundedButton
                                width={wp("98%")}
                                backgroundColor={AppColors.secondaryColor}
                                text="Create an account" onPressFromInterface={() => {
                                    navigation.navigate("EmailScreen")
                                    setLogin(false)
                                }}/>
                        </View>
                        <Toast/>
                    </>
                )}
        </View >
    );
}