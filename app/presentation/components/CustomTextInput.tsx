import React from "react";
import {Image, KeyboardType, StyleSheet, Text, TextInput, View} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP
} from "react-native-responsive-screen";

interface Props {
    label: string,
    keyboardType:KeyboardType;
    secureTextEntry:boolean;
    maxLenght?: number;
    width?: "large" | "small";
    autoFocus?: boolean;
    value?:string;
    onChangeText:(text:string)=>void;
}
export const CustomTextInput = ({label, autoFocus, value, width, maxLenght, keyboardType,secureTextEntry,onChangeText}:Props) => {
    return (
        <View>
            <Text style={stylesCustomTextInput.formInputLabel}>{label}</Text>
            <TextInput style={{...stylesCustomTextInput.formInput, width: width === "large" ? wp("79%") : wp("67%")}}
                       keyboardType={keyboardType}
                       secureTextEntry={secureTextEntry}
                       maxLength={maxLenght}
                       autoFocus={autoFocus}
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
        width:wp("79%"),
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

