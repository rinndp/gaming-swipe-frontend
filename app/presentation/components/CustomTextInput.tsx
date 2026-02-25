import React from "react";
import {Image, KeyboardType, StyleSheet, TextInput, View} from "react-native";
import {Text} from "./Text";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP
} from "react-native-responsive-screen";
import { AppColors } from "../theme/AppTheme";
import { useTheme } from "../theme/ThemeContext";

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
    const { colors } = useTheme();
    const style = stylesCustomTextInput(colors);
    return (
        <View>
            <Text style={style.formInputLabel}>{label}</Text>
            <TextInput style={{...style.formInput, width: width === "large" ? wp("79%") : wp("67%")}}
                       keyboardType={keyboardType}
                       secureTextEntry={secureTextEntry}
                       maxLength={maxLenght}
                       autoFocus={autoFocus}
                       allowFontScaling={false}
                       defaultValue={value}
                       cursorColor={colors.gray}
                       onChangeText={(text) => onChangeText(text)}
            ></TextInput>
        </View>
    )

}
export const stylesCustomTextInput = (colors: any) => StyleSheet.create({
    formInputLabel: {
        fontSize:wp("3.4%"),
        color: colors.white,
        marginStart: 5,
        alignSelf:"flex-start",
        marginBottom:5,
        fontFamily: "zen_kaku_regular"
    },

    formInput: {
        height:hp("4.5%"),
        fontSize: wp("3.6%"),
        backgroundColor: 'white',
        color:"black",
        paddingVertical: wp("1%"),
        paddingHorizontal: wp("2%"),
        borderRadius:10,
        borderWidth: 0.2,
        fontFamily: "zen_kaku_regular"

    }
})

