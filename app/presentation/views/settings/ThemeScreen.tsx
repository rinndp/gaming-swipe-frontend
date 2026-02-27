import { TouchableOpacity, View } from "react-native";
import { Text } from "../../components/Text";
import styleAccount from "../account/StyleAccount";
import { AppColors, AppFonts } from "../../theme/AppTheme";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { PropsStackNavigation } from "../../interfaces/StackNav";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { styleGameDetails } from "../details/StyleGameDetails";
import { useEffect, useMemo, useState } from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import { useTheme } from "../../provider/ThemeProvider";



export function ThemeScreen({navigation = useNavigation()}: PropsStackNavigation) {
    
    const { theme, setTheme, colors } = useTheme();  

    const radioButtons = [
        {
            id: 'default',
            label: 'Default',
            value: 'default',
            color: colors.white,
            borderColor: colors.white,
        },
        {
            id: 'light',
            label: 'Light',
            value: 'light',
            color: colors.white,
            borderColor: colors.white,
        }
    ];

    const [selectedId, setSelectedId] = useState<string | undefined>(theme);

    useEffect(() => {
        if (selectedId) {
            setTheme(selectedId as 'default' | 'light');
        }
    }, [selectedId]);

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
            <View style={{paddingHorizontal:wp("5%")}}>
                <Animated.View entering={FadeInLeft.duration(800)} style={{position: "relative", gap: wp("4%"), flexDirection: "row", alignItems: "center", marginTop: hp("5%")}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Image source={require("../../../../assets/go-back-icon.png")} style={[styleGameDetails(colors).goBackIcon, {marginTop: hp("0.5%")}]}/>
                    </TouchableOpacity>
                    <Text style={[styleAccount(colors).title, {alignSelf: "flex-start", top: hp("0%")}]}>Themes</Text>
                </Animated.View>
                <Animated.View entering={FadeInUp.duration(800)} style={{marginTop: hp("3%"), alignItems: "flex-start"}}>
                <RadioGroup 
                        radioButtons={radioButtons} 
                        containerStyle={{alignItems: "flex-start", gap: hp("2%")}}
                        onPress={(selectedId: string) => setSelectedId(selectedId)}
                        labelStyle={{color: colors.white, fontFamily: AppFonts.medium, fontSize: wp("4%")}}
                        selectedId={selectedId}
                    />
                </Animated.View>
            </View>
        </View>
    )
}