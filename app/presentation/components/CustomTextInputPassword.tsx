import React, {useState} from "react";
import {Image, KeyboardType, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {stylesCustomTextInput} from "./CustomTextInput";

interface Props {
    label: string,
    keyboardType:KeyboardType;
    onChangeText:(text:string)=>void;
}
export const CustomTextInputPassword = ({label, keyboardType,onChangeText}:Props) => {
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
        marginStart:240,

    },

    formInput: {
        width:"100%",
        position:"absolute",
    },

    formInputContainerPassword: {
        width:300,
        height:40,
        fontSize: 15,
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 1,
        flexDirection:'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        fontFamily: "zen_kaku_regular"

    }
})

