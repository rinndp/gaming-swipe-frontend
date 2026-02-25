import React from "react";
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from "react-native";
import {Text} from "./Text";
import {AppColors} from "../theme/AppTheme";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP
} from "react-native-responsive-screen";
import {Image, ImageSource} from "expo-image"
import {ActivtyIndicatorCustom} from "./ActivtyIndicatorCustom";
import styleHome from "../views/home/StyleHome";
import { useTheme } from "../theme/ThemeContext";

interface Props {
    text: string,
    onPressFromInterface: () => void,
    width?: number
    backgroundColor?: string,
    logo?: ImageSource
    loading?: boolean
    textColor?: string
}

export const RoundedButton = ({text, loading, onPressFromInterface, width, backgroundColor, logo, textColor}: Props) => {
    const { colors, theme } = useTheme();
    return(

        <TouchableOpacity
            style={{...stylesRoundedButton(colors).formButton, width: width, backgroundColor: backgroundColor}}
            onPress={() => onPressFromInterface()}
        >
            <View style={{flexDirection: "row", justifyContent:"center", gap:7}}>
                {loading ? (
                    <>
                        <ActivityIndicator style={styleHome(colors).loading} size="small" color={colors.white} animating={loading} />
                    </>
                ):(
                    <>
                        {logo && (
                            <>
                                <Image source={logo} style={stylesRoundedButton(colors).logo}/>
                            </>
                        )}
                        <Text style={{...stylesRoundedButton(colors).formButtonText, color: textColor ? textColor : colors.white}}>{text}</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>

    )
}
export const stylesRoundedButton = (colors: any) => StyleSheet.create({
    formButton:{
        elevation: 2,
        borderRadius: 6,
        justifyContent: 'center',
        padding: wp("3%"),
        height: hp("5.5%"),
        backgroundColor: colors.buttonBackground,
    },
    formButtonText:{
        fontSize: wp("4%"),
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: "zen_kaku_regular",
        justifyContent: 'center',
    },
    logo: {
        width: wp("5%"),
        height: hp("2%"),
        marginTop:hp("0.3%")
    }
})