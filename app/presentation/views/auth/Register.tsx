import React, {useEffect} from "react";
import styles from "./StylesAuthViews";
import {View, Text, ImageBackground, SafeAreaView} from "react-native";
import {CustomTextInput} from "../../components/CustomTextInput";
import {RoundedButton} from "../../components/RoundedButton";
import viewModel, {registerViewModel} from "./ViewModel";
import Toast from "react-native-toast-message";
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";

export function RegisterScreen() {

    const {onChangeRegister, register, errorMessage, setErrorMessage} = registerViewModel()

    useEffect(() => {
        if(errorMessage !== "") {
            Toast.show({
                type: 'error',
                text1: errorMessage,
            });
        }
        setErrorMessage("");
    }, [errorMessage])

    return(
            <View style={styles.container}>
                <ImageBackground source={require("../../../../assets/background.png")}
                                 style={{width: '100%', height: '100%'}}>
                    <View style={styles.formContainer}>
                        <Text style={styles.titleRegister}>Create an account</Text>
                        <View style={styles.formInputContainer}>
                            <CustomTextInput label={"Username"}
                                             keyboardType={"default"}
                                             maxLenght={15}
                                             secureTextEntry={false}
                                             onChangeText={(text) => onChangeRegister("username", text)}/>
                            <CustomTextInput label={"Email"}
                                             keyboardType={"default"}
                                             secureTextEntry={false}
                                             onChangeText={(text) => onChangeRegister("email", text)}/>
                            <View>
                                <CustomTextInputPassword label={"Password"}
                                                 keyboardType={"default"}
                                                 onChangeText={(text) => onChangeRegister("password", text)}/>
                                <Text style={styles.passwordHint}>Password must have at least 8 characters</Text>
                            </View>
                            <CustomTextInputPassword label={"Confirm password"}
                                             keyboardType={"default"}
                                             onChangeText={(text) => onChangeRegister("confirmPassword", text)}/>
                        </View>
                        <View style={styles.formButtonContainer}>
                            <RoundedButton text={"Sign Up"} onPressFromInterface={() => register()}/>
                        </View>
                    </View>
                    <Toast/>
                </ImageBackground>
            </View>
    )
}