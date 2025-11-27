import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP
} from "react-native-responsive-screen";
import {Image, ImageSource} from "expo-image"

interface Props {
    text: string,
    onPressFromInterface: () => void,
    width?: number
    backgroundColor?: string,
    logo?: ImageSource
}

export const RoundedButton = ({text, onPressFromInterface, width, backgroundColor, logo}: Props) => {
    return(

        <TouchableOpacity
            style={{...stylesRoundedButton.formButton, width: width, backgroundColor: backgroundColor}}
            onPress={() => onPressFromInterface()}
        >
            <View style={{flexDirection: "row", justifyContent:"center", gap:7}}>
                {logo && (
                    <>
                        <Image source={logo} style={stylesRoundedButton.logo}/>
                    </>
                )}
                <Text style={stylesRoundedButton.formButtonText}>{text}</Text>
            </View>
        </TouchableOpacity>

    )
}
export const stylesRoundedButton = StyleSheet.create({
    formButton:{
        elevation: 5,
        borderRadius: 6,
        justifyContent: 'center',
        padding: wp("3%"),
        backgroundColor: AppColors.buttonBackground,
    },
    formButtonText:{
        fontSize: wp("4%"),
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: "zen_kaku_regular",
        justifyContent: 'center',
        color: AppColors.white,
    },
    logo: {
        width: wp("5%"),
        height: hp("2%"),
        marginTop:hp("0.3%")
    }
})