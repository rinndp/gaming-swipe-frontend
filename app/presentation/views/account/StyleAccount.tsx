import { StyleSheet } from "react-native";
import { AppColors } from "../../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styleAccount = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },

    charactersCounter: {
        color: AppColors.white,
    },

    passwordHint: {
        fontFamily: "zen_kaku_regular",
        color: AppColors.white,
        fontSize: 14,
        height: 20,
        marginTop: wp("-3"),
        marginStart: wp("2%"),
        alignSelf: "flex-start",
    },

    logo: {
        width: wp("12%"),
        height: wp("12%"),
        top: hp("2%"),
    },
    appName: {
        fontSize: wp("4%"),
        top: hp("3%"),
        color: AppColors.white,
        fontFamily: "zen_kaku_light",
    },
    header: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: hp("2%"),
    },
    title: {
        fontSize: wp("7.5%"),
        alignSelf: "center",
        top: hp("6%"),
        color: AppColors.white,
        fontFamily: "zen_kaku_light",
    },
    containerEmail: {
        alignSelf: "center",
        top: hp("8%"),
    },
    textEmail: {
        fontSize: wp("4.5%"),
        height: hp("4%"),
        color: AppColors.white,
        fontFamily: "zen_kaku_medium",
    },
    containerPhoto: {
        alignItems: "center",
        top: hp("9%"),
    },
    containerEditName: {
        flexDirection: "row",
        alignItems: "center",
    },
    containerInfo: {
        marginTop: hp("30%"),
        width: "100%",
    },
    labelName: {
        fontSize: wp("4.1%"),
        color: AppColors.white,
        fontFamily: "zen_kaku_medium",
    },
    Name: {
        fontSize: wp("4.9%"),
        marginTop: hp("1%"),
        width: "90%",
        lineHeight: 40,
        color: AppColors.white,
        fontFamily: "zen_kaku_light",
    },
    editButton: {
        width: wp("7%"),
        height: wp("7%"),
        alignSelf: "flex-end",
        tintColor: AppColors.white,
    },
    containerLastName: {
        marginTop: hp("4%"),
    },
    containerResetPassword: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp("7%"),
    },
    TextResetPassword: {
        fontSize: wp("3.5%"),
        color: AppColors.white,
        textDecorationLine: "underline",
        fontFamily: "zen_kaku_regular",
        lineHeight:25,

    },
    containerLogOut: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: hp("8%"),
    },
    LogOut: {
        fontSize: wp("5%"),
        color: AppColors.red,
        fontFamily: "zen_kaku_regular",
    },
    modalText: {
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    modalView: {
        backgroundColor: AppColors.buttonBackground,
        borderRadius: 15,
        padding: wp("5%"),
        gap: hp("2%"),
        width: wp("80%"),
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalAcceptButton: {
        alignItems: "center",
        width: "25%",
        marginTop: 15,
        padding: 10,
        backgroundColor: "#0d5700",
        borderRadius: 10,
    },

    modalCancelButton: {
        alignItems: "center",
        width: "25%",
        marginTop: 15,
        padding: 10,
        backgroundColor: "#5b0000",
        borderRadius: 10,
    },
    containerButton:{
        flexDirection: "row",
        gap: wp("30%")
    },
    modalButtonTextStyle: {
        color: "white",
        fontSize: wp("3.5%"),
        fontWeight: "bold",
        fontFamily: "zen_kaku_regular",
        lineHeight:20,
    },
    textPopUp:{
        fontSize: wp("4%"),
        color: AppColors.white,
        textAlign: "center",
        fontFamily: "zen_kaku_regular",
        height:hp("3%"),
        verticalAlign: "middle"
    },

    gameNamePopUp:{
        fontSize: wp("4.3%"),
        color: AppColors.white,
        textAlign: "center",
        fontFamily: "zen_kaku_medium",
        height: "auto",
        lineHeight: hp("3%"),
        verticalAlign: "middle"
    },

    logOutIcon: {
        tintColor: AppColors.red,
        marginStart:wp("2%"),
        width: wp("4%"),
        height: hp("2%"),
    }
});

export default styleAccount;
