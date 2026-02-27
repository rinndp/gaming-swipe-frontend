import { useNavigation } from "@react-navigation/native";
import { Linking, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/Text";
import styleAccount from "../account/StyleAccount";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { PropsStackNavigation } from "../../interfaces/StackNav";
import { styleGameDetails } from "../details/StyleGameDetails";
import { Image } from "expo-image";
import Animated, { FadeInLeft, FadeInUp, FadeOutLeft } from "react-native-reanimated";
import { accountViewModel } from "../account/ViewModel";
import stylesHome from "../home/StyleHome";
import stylesSettings from "./StylesSettings";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../provider/ThemeProvider";
import { removeUserUseCase } from "../../../domain/usesCases/user-local/RemoveUser";
import { clearTokens } from "../../../data/sources/local/secure/TokenStorage";


interface SettingsItem {
    title: string;
    icon: string;
    items: {
        title: string;
        color?: string;
        onPress: () => void;
    }[];
}


export function SettingsScreen({navigation = useNavigation()}: PropsStackNavigation) {

    const { colors } = useTheme();
    const style = stylesSettings(colors);

    const deleteSession = async () => {
        await removeUserUseCase()
        await clearTokens()
    }
    
    const settings: SettingsItem[] = [
        {
            title: "Appearance",
            icon:"color-palette",
            items: [
                {
                    title: "Theme",
                    onPress: () => {
                        navigation.navigate("ThemeScreen")
                    }
                },
                
            ]
        },
        {
            title: "About",
            icon: "help-circle",
            items: [
                {
                    title: "Tutorial",
                    onPress: () => {
                        navigation.navigate("TutorialScreen", {firstTime: false})                 
                    }
                },
                {
                    title: "Privacy Policy and Terms of Service",
                    onPress: () => {
                        Linking.openURL("https://www.termsfeed.com/live/7f86ce7f-7566-454f-a8da-94d5f0007ef5")
                    }
                },
            ]
        },
        {
            title: "Account",
            icon: "person",
            items: [
                {
                    title: "Log out",
                    color: colors.red,
                    onPress: async () => {
                        await deleteSession();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "WelcomeScreen" }],
                        });
                    }
                }
            ]
        }    
    ]

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
            <View style={{paddingHorizontal:wp("5%")}}>
                <Animated.View entering={FadeInLeft.duration(800)} exiting={FadeOutLeft.duration(800)} style={{position: "relative", gap: wp("4%"), flexDirection: "row", alignItems: "center", marginTop: hp("5%")}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Image source={require("../../../../assets/go-back-icon.png")} style={[styleGameDetails(colors).goBackIcon, {marginTop: hp("0.5%")}]}/>
                    </TouchableOpacity>
                    <Text style={[styleAccount(colors).title, {alignSelf: "flex-start", top: hp("0%")}]}>Settings</Text>
                </Animated.View>
                <Animated.View entering={FadeInUp.duration(800)} style={{marginTop: hp("3%")}}>
                    {settings.map((item, index) => (
                        <View key={index} style={style.sectionCard}>
                            <View style={{flexDirection: "row", alignItems: "center", gap: wp("2%")}}>
                                <Ionicons name={item.icon as any} size={17} color={colors.white} style={{marginTop: hp("0.3%")}} />
                                <Text style={style.sectionCardTitle}>{item.title}</Text>
                            </View>
                            {item.items.map((item, index) => (
                                <TouchableOpacity key={index} onPress={item.onPress} style={{paddingVertical: hp("1%")}}>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: wp("2%"), justifyContent: "space-between"}}>
                                        <Text style={[style.sectionItemLabel, {color: item.color || colors.white}]}>{item.title}</Text>
                                        <Ionicons name="arrow-forward-outline" size={15} color={item.color || colors.white} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </Animated.View>
            </View>
        </View>
    )
}