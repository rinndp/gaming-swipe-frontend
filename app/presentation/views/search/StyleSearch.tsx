import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AppColors } from "../../theme/AppTheme";


const styleSearch = (colors: any) => StyleSheet.create({
    logo: {
        width: wp("12%"),
        height: hp("4%"),
        marginTop: hp("2%"),
        tintColor: colors.white,
    },
    container: {
        flex: 1,
        alignItems: "center",
    },
    appName: {
        fontSize: wp("4%"),
        alignSelf: "center",
        lineHeight: 23,
        marginTop: hp("0.7%"),
        fontFamily: "zen_kaku_light",
    },

    logoContainer: {
        flexDirection: "row",
        alignSelf: "center",
        gap: 6,
        justifyContent: "center",
        marginTop: hp("5.5%"),
    },

    headerTitle: {
        fontSize: wp("7%"),
        alignSelf: "center",
        marginBottom: hp("1%"),
        fontFamily: "zen_kaku_light",
    },
    containerSearchInput: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("2%"),
        alignSelf: "center",
    },

    gameCardsContainer: {
        flex:1,
    },

    gameCover: {
        width: wp("15%"),
        height: hp("10%"),
        borderRadius: 5,
        marginRight: wp("2%"),
    },

    containerHeader:{
        elevation:2,
        backgroundColor: colors.buttonBackground,
    },

    resultTextContainer: {
        backgroundColor: colors.buttonBackground,
        padding: 13,
        borderColor: colors.opacWhite,
        elevation: 10,
        alignItems: "center",
    },

    resultText: {
        fontSize: wp("4.4%"),
        height: 28,
        verticalAlign: "middle",
        marginBottom: hp("0.2%"),
        color: colors.white,
        fontFamily: "zen_kaku_regular",
    },
    resultTextFilter: {
        fontSize: 15,
        color: "#fff",
        lineHeight: 28,
        fontFamily: "zen_kaku_regular",
    },

    emptyFlatListText : {
        fontSize: wp("4%"),
        color: "#ad2c2c",
        height: 28,
        fontFamily: "zen_kaku_regular",
    },
    clearFilterButton: {
        marginLeft: wp("4%"),
        borderRadius: 15,
    },
    filterTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    clearFilterText: {
        fontSize: wp("3%"),
        color: colors.red,
    },
    item: {
        width:wp("7%"),
        height:hp("2.4%"),
        paddingHorizontal: wp("2%"),
        tintColor:colors.white,
    },
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: hp("0.5%"),
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    tabButtonSelected: {
        borderBottomColor: colors.focusSearchTabColor,
    },
    tabText: {
        color: "gray",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "zen_kaku_regular",
    },
    tabTextSelected: {
        color: "white",
        fontWeight: "bold",
    },

});



const styleSearchCompanyItem = (colors: any) => StyleSheet.create({
    companyCover: {
        margin: wp("3%"),
        width: wp("25%"),
        height: hp("15%"),
        borderRadius: 5,
        marginRight: 10,
    },
    infoContainer: {
        marginLeft:10,
        flexDirection: "column",
    },
    name: {

        marginBottom: hp("2%"),
    },
    companyName: {
        fontSize: 15,
        lineHeight: 20,
        marginStart: wp("3%"),
        fontFamily: "zen_kaku_regular",
    },
    description:{
        width: wp("60%"),
        fontFamily: "zen_kaku_regular",
    },

});

const styleSearchUserItem = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: wp("3%"),
        gap: wp("1%")
    },

    name: {
        fontSize: wp("3.3%"),
        lineHeight: 20,
        alignSelf:"center",
        fontFamily: "zen_kaku_regular",
    },

    image: {
        width:wp("15%"),
        height:wp("15%"),
        borderRadius:50,
        marginEnd: wp("5%"),
        alignItems:"center",
    }

})


export {styleSearch, styleSearchCompanyItem, styleSearchUserItem};
