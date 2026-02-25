import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { AppColors } from "../../theme/AppTheme";

const styleFav = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },

    header: {
        paddingTop: hp("9%"),
        elevation:10,
        backgroundColor: colors.buttonBackground,
    },
    title: {
        height: 70,
        fontSize: wp("7.5%"),
        alignSelf: "center",
        paddingBottom: 20,
        verticalAlign: "middle",
        fontFamily: "zen_kaku_light",
    },

    footerFavGames: {
        alignSelf: "center",
        width: "100%",
        textAlign: "center",
        fontSize: wp("3%"),
        height: hp("5.3%"),
        paddingVertical: hp("1.4%"),
        fontFamily: "zen_kaku_regular",
    }
});

export default styleFav;
