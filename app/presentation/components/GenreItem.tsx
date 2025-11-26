import {Dimensions, Text, View} from "react-native";
import {Genre, Platform} from "../../domain/entities/Game";
import {StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";


export const GenreItem = ({item}: {item: Genre}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{item.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.secondaryColor,
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
        color: AppColors.white,
    }
})