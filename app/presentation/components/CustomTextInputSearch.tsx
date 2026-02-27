import React from "react";
import { TextInput, KeyboardType, StyleSheet } from "react-native";
import { AppColors } from "../theme/AppTheme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { useTheme } from "../provider/ThemeProvider";

interface Props {
    keyboardType: KeyboardType;
    secureTextEntry: boolean;
    onPressButtonFromInterface: (text: string) => void;
    value?: string;
}

export const CustomTextInputSearch = ({keyboardType, secureTextEntry, onPressButtonFromInterface, value}: Props) => {
    const { colors } = useTheme();
    const style = styles(colors);
    return (
        <TextInput
            style={style.formInput}
            keyboardType={keyboardType}
            placeholder={"Type here..."}
            placeholderTextColor={colors.white}
            secureTextEntry={secureTextEntry}
            allowFontScaling={false}
            onChangeText={(text) => onPressButtonFromInterface(text)}
            value={value}
        />
    );
};

const styles = (colors: any) => StyleSheet.create({
    formInput: {
        fontSize: wp("3.4%"),
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
        borderRadius: 15,
        color: colors.white,
        backgroundColor: colors.secondaryColor,
        height: hp("4.5%"),
        width: "75%",
        fontFamily: "zen_kaku_regular",
    },
});
