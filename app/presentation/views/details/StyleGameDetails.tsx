import {StyleSheet} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {AppColors} from "../../theme/AppTheme";
import { useTheme } from "../../theme/ThemeContext";


const styleGameDetails = (colors: any) => StyleSheet.create({
    
    image: {
        width: wp("43%"),
        height: hp("27%"),
    },
    dot: {
        width: wp("2%"),
        height: hp("0.3%"),
    },
    header: {
        width: wp("100%"),
        flexDirection: "row",
        paddingTop: hp("13%"),
        paddingBottom: hp("2%"),
        paddingHorizontal: hp("2%"),
        elevation: 14,
        gap: 20,
        zIndex: 2,
        backgroundColor: colors.buttonBackground,

    },

    goBackIconTouchable: {
        start:wp("3%"),
        bottom: hp("30%"),
        position: "absolute",
        height: hp("5%"),
        justifyContent: "center",
    },

    goBackIcon: {
        width: wp("7%"),
        height: hp("3%"),
        tintColor: colors.white,
    },

    name: {
        fontSize: wp("4.5%"),
        height: hp("22.5%"),
        width: "85%",
        fontFamily: "zen_kaku_regular"
    },

    rating: {
        backgroundColor: colors.secondaryColor,
        padding: wp("2%"),
        width: wp("15%"),
        textAlign:"center",
        borderRadius: 14,
        lineHeight: hp("2%"),
        fontSize: wp("3.2%"),
    },

    infoTitles: {
        fontFamily: "zen_kaku_bold",
        lineHeight: hp("5%"),
        textTransform: "uppercase",
        fontSize: wp("3.7%"),
        marginTop: hp("2.5%"),
        marginBottom: hp("1.5%"),

    },

    summary: {
        fontFamily: "zen_kaku_regular",
        fontSize: wp("3.5%"),
        lineHeight: 27,
        textAlign: "justify",
    },

    involvedCompany: {
        fontFamily: "zen_kaku_regular",
        lineHeight: 50,
        borderBottomWidth: 1,
        borderBottomColor: colors.neonPurpleTransparent,
        fontSize: wp("3.5%"),
    },

    fav:{
        width:wp("6.4%"),
        height:hp("3.3%"),
        tintColor:"#4dc51f",
    },
})

const styleSimilarGame = (colors: any) => StyleSheet.create({
    card: {
        width: wp("37%"),
        height: hp("31.6%"),
        marginRight: wp("2.5%"),
        marginBottom: hp("5%"),
        marginTop: hp("2%"),
        borderRadius: 10,
        backgroundColor: colors.backgroundColor,
        elevation: 1,
    },

    image: {
        width: "100%",
        height: hp("22.7%"),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },

    name: {
        fontSize: wp("2.9%"),
        padding: wp("2.5%"),
        flex:1,
        textAlign: "center",
        fontFamily: "zen_kaku_regular",
    },
})

export { styleGameDetails, styleSimilarGame };


