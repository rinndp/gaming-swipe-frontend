import { StyleSheet } from "react-native";
import { AppColors } from "../../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styleFav = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },

    header: {
        paddingTop: hp("9%"),
        elevation:10,
        backgroundColor: AppColors.buttonBackground,
    },
    title: {
        height: 70,
        fontSize: wp("7.5%"),
        alignSelf: "center",
        paddingBottom: 20,
        verticalAlign: "middle",
        color: AppColors.white,
        fontFamily: "zen_kaku_light",
    },

    footerFavGames: {
        alignSelf: "center",
        color: AppColors.white,
        width: "100%",
        textAlign: "center",
        fontSize: wp("3%"),
        height: hp("5.3%"),
        paddingVertical: hp("1.4%"),
        fontFamily: "zen_kaku_regular",
    }
});

export default styleFav;
