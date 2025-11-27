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

    titleLogin: {
        fontSize: 40,
        color: 'white',
        marginTop: hp("20%"),
        alignSelf: 'flex-start',
        marginStart: wp("15%"),
        marginBottom: hp("5%"),
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

    formContainer: {
        width: '100%',
        alignItems: 'center',
    },

    formInputContainer: {
        gap:hp("2%")
    },

    formInputContainerPassword: {
        marginBottom: hp("2.5%"),
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
    },

    iconPasswordToggle: {
        width: wp("5%"),
        height: wp("5%"),
        resizeMode: 'stretch',
        backgroundColor: 'white',
    },

    formButtonContainer: {
        marginTop: hp("25%"),
        alignItems: "center",
        gap: hp("0.5%"),
    },

    formInlineInputsContainer: {
        flexDirection: "row",
        marginBottom: hp("2.5%"),
        gap: wp("2.5%"),
    },
});

export default stylesAuthViews;
