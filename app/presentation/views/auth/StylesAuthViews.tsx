import {StyleSheet} from "react-native";
import {AppColors, AppFonts} from "../../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";

const stylesAuthViews = (colors: any) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.backgroundColor,
    },

    welcomeText: {
        fontSize: wp("10%"),
        fontFamily: "zen_kaku_light",
    },

    h2: {
        fontSize: wp("5.8%"),
        fontFamily: "zen_kaku_light",
        color: colors.white,
    },

    titleRegister: {
        fontSize: wp("8%"),
        marginTop: hp("12%"),
        marginBottom: hp("5%"),
        fontFamily: "zen_kaku_light",
    },

    passwordHint: {
        fontFamily: "zen_kaku_regular",
        fontSize: wp("2.6%"),
        margin: wp("1%")
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
