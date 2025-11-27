import React from "react";
import {Image, KeyboardType, StyleSheet, Text, TextInput, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

interface Props {
    label: string,
    keyboardType:KeyboardType;
    secureTextEntry:boolean;
    maxLenght?: number;
    value?:string;
    onChangeText:(text:string)=>void;
}
export const CustomTextInput = ({label, value, maxLenght, keyboardType,secureTextEntry,onChangeText}:Props) => {
    return (
        <View>
            <Text style={stylesCustomTextInput.formInputLabel}>{label}</Text>
            <TextInput style={stylesCustomTextInput.formInput}
                       keyboardType={keyboardType}
                       secureTextEntry={secureTextEntry}
                       maxLength={maxLenght}
                       defaultValue={value}
                       onChangeText={(text) => onChangeText(text)}
            ></TextInput>
        </View>
    )

}
export const stylesCustomTextInput = StyleSheet.create({
    formInputLabel: {
        fontSize:wp("3.4%"),
        color:'white',
        marginStart: 5,
        alignSelf:"flex-start",
        marginBottom:5,
        fontFamily: "zen_kaku_regular"
    },

    formInput: {
        width:wp("78%"),
        height:hp("4.5%"),
        fontSize: wp("3.6%"),
        backgroundColor: 'white',
        color:"black",
        paddingVertical: wp("1%"),
        paddingHorizontal: wp("2%"),
        borderRadius:10,
        fontFamily: "zen_kaku_regular"

    }
})

