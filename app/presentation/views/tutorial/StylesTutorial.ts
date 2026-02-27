import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const stylesTutorial = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingHorizontal: wp("10%"), 
        position: "absolute", 
        top: hp("7%"), 
        left: 0, 
        right: 0, 
        zIndex: 999
    },

    buttonsContainer: {
        gap:hp("7%"), 
        alignItems: "center", 
        flexDirection: "row", 
        alignSelf: "center", 
        position: "absolute", 
        bottom: hp("8%"), 
        zIndex: 1000
    }
});

export default stylesTutorial;