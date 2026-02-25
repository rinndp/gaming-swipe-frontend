import { StyleSheet } from "react-native";
import { AppColors } from "../../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const stylesSettings = (colors: any) => StyleSheet.create({
    sectionCard: {
        marginBottom: hp("1%"),
        backgroundColor: colors.buttonBackground,
        padding: wp("5%"),
        borderRadius: 15,
        gap: wp("2%"),
    },
    sectionCardTitle: {
        fontSize: wp("4.5%"),
        fontFamily: "zen_kaku_medium",
    },
    sectionItemLabel: {
        fontSize: wp("4.1%"),
        fontFamily: "zen_kaku_medium",
    },
});

export default stylesSettings;
