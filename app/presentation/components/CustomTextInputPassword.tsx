import React, {useState} from "react";
import {Image, KeyboardType, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Text} from "./Text";
import {stylesCustomTextInput} from "./CustomTextInput";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {validateEmail} from "../utils/ValidateEmail";
import { useTheme } from "../provider/ThemeProvider";

interface Props {
    label: string,
    keyboardType:KeyboardType;
    onChangeText:(text:string)=>void;
    autoFocus?:boolean;
    value?: string;
}
export const CustomTextInputPassword = ({label, autoFocus, value, keyboardType,onChangeText}:Props) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [iconPassword, setIconPassword] = useState("closed-eye");
    const { colors } = useTheme();
    const togglePassword = () => {
        if (secureTextEntry) {
            setSecureTextEntry(false);
            setIconPassword("eye");
        } else {
            setSecureTextEntry(true);
            setIconPassword("closed-eye");
        }
    }

    return (
        <View>
            <Text style={stylesCustomTextInput(colors).formInputLabel}>{label}</Text>
            <View style={styles.formInputContainerPassword}>
                <TextInput style={styles.formInput}
                           keyboardType={keyboardType}
                           defaultValue={value}
                           autoFocus={autoFocus}
                           allowFontScaling={false}
                           cursorColor={colors.gray}
                           secureTextEntry={secureTextEntry}
                           onChangeText={(text) => onChangeText(text)}
                ></TextInput>
                <TouchableOpacity onPress={togglePassword} style={styles.iconPasswordToggle}>
                    <Image source={iconPassword === "closed-eye"
                        ? require("../../../assets/closed-eye.png")
                        : require("../../../assets/eye.png")
                    } style={styles.iconPasswordToggle}/>
                </TouchableOpacity>
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    iconPasswordToggle: {
        width:30,
        height:30,
        alignSelf: "center",
    },

    formInput: {
        width:"90%",
        fontFamily: "zen_kaku_regular",
        color:"black",
    },

    formInputContainerPassword: {
        width:wp("78%"),
        height:hp("4.5%"),
        fontSize: wp("3.6%"),
        backgroundColor: 'white',
        flexDirection:'row',
        color:"black",
        borderWidth: 0.2,
        paddingHorizontal: wp("2%"),
        borderRadius:10,
        alignItems:'center',
        fontFamily: "zen_kaku_regular"

    }
})

