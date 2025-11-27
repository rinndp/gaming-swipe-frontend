import {Dimensions, Text, View} from "react-native";
import {Platform} from "../../domain/entities/Game";
import {StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";


export const PlatformItem = ({item}: {item: Platform}) => {
    return (
        <View style={stylesPlatformItem.container}>
                <Text style={stylesPlatformItem.abbreviation}>{item.abbreviation ? item.abbreviation : item.name}</Text>
        </View>
    )
}

export const stylesPlatformItem = StyleSheet.create({
    container: {
        backgroundColor: AppColors.thirdColor,
        borderRadius: 15,
        paddingHorizontal: wp("2%"),
        height: hp("3.3%"),
        alignSelf:'center',
        alignItems: "center",
        justifyContent: 'center',
        marginEnd: wp("1%"),
    },

    abbreviation: {
        fontSize: wp("3%"),
        verticalAlign: "middle",
        fontFamily: "zen_kaku_regular",
        color: AppColors.white,
    }
})