import {StyleSheet} from "react-native";
import {AppColors, AppFonts} from "../../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";

const stylesAuthViews = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: AppColors.backgroundColor,
    },

    welcomeText: {
        fontSize: wp("10%"),
        color: 'white',
        fontFamily: "zen_kaku_light",
    },

    h2: {
        fontSize: wp("5.8%"),
        color: 'white',
        fontFamily: "zen_kaku_light",
    },

    titleRegister: {
        fontSize: wp("8%"),
        color: AppColors.white,
        marginTop: hp("12%"),
        marginBottom: hp("5%"),
        fontFamily: "zen_kaku_light",
    },

    passwordHint: {
        fontFamily: "zen_kaku_regular",
        color: AppColors.white,
        fontSize: wp("2.6%"),
        margin: wp("2%")
    },

    welcomeTextContainer: {
        alignItems: 'center',
        marginTop: hp("30%"),
    },

    formButtonContainer: {
        marginTop: hp("25%"),
        alignItems: "center",
        gap: hp("0.5%"),
    },
});

export default stylesAuthViews;
