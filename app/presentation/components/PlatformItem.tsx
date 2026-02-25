import {Dimensions, View} from "react-native";
import {Text} from "./Text";
import {Platform} from "../../domain/entities/Game";
import {StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";


export const PlatformItem = ({item, colors, home, theme}: {item: Platform, colors: any, home?: boolean, theme?: string}) => {
    const style = stylesPlatformItem(colors);
    return (
        <View style={[style.container, {backgroundColor: home && theme === "light" ? colors.backgroundColor : colors.thirdColor}]} pointerEvents="box-none">
                <Text style={style.abbreviation}>
                    {item.abbreviation ? item.abbreviation : item.name}
                </Text>
        </View>
    )
}

export const stylesPlatformItem = (colors: any) => StyleSheet.create({
    container: {
        backgroundColor: colors.thirdColor,
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
    }
})