import {Dimensions, View} from "react-native";
import {Text} from "./Text";
import {Genre, Platform} from "../../domain/entities/Game";
import {StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { useTheme } from "../theme/ThemeContext";


export const GenreItem = ({item, colors, home, theme}: {item: Genre, colors: any, home?: boolean, theme?: string}) => {
    const styleGI = styles(colors);
    return (
        <View style={[styleGI.container, {backgroundColor: home && theme === "light" ? colors.backgroundColor : colors.genreBackground}]} pointerEvents="box-none">
            <Text style={styleGI.name}>
                {item.name}
            </Text>
        </View>
    )
}

const styles = (colors: any ) => StyleSheet.create({
    container: {
        backgroundColor: colors.genreBackground,
        borderRadius: 15,
        paddingHorizontal: wp("2.5%"),
        height: hp("3.3%"),
        alignSelf:'baseline',
        alignItems: "center",
        justifyContent: 'center',
        marginEnd: wp("1%"),
    },

    name: {
        fontSize: wp("3%"),
        verticalAlign: "middle",
        fontFamily: "zen_kaku_regular",
    }
})