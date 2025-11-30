import React, {useState} from "react";
import {Image, KeyboardType, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {stylesCustomTextInput} from "./CustomTextInput";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {validateEmail} from "../utils/ValidateEmail";

interface Props {
    label: string,
    keyboardType:KeyboardType;
    onChangeText:(text:string)=>void;
    value?: string;
}
export const CustomTextInputPassword = ({label, value, keyboardType,onChangeText}:Props) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [iconPassword, setIconPassword] = useState("closed-eye");

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
            <Text style={stylesCustomTextInput.formInputLabel}>{label}</Text>
            <View style={styles.formInputContainerPassword}>
                <TextInput style={styles.formInput}
                           keyboardType={keyboardType}
                           defaultValue={value}
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
        alignSelf: "flex-end",
        resizeMode:'stretch',

    },

    formInput: {
        width:"90%",
        fontFamily: "zen_kaku_regular"
    },

    formInputContainerPassword: {
        width:wp("78%"),
        height:hp("4.5%"),
        fontSize: wp("3.6%"),
        backgroundColor: 'white',
        borderWidth: 1,
        flexDirection:'row',
        color:"black",
        paddingVertical: wp("1%"),
        paddingHorizontal: wp("2%"),
        borderRadius:10,
        alignItems:'center',
        fontFamily: "zen_kaku_regular"

    }
})

