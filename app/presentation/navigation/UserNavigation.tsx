import {Home} from "../views/home/Home";
import {Image, Platform, StyleSheet} from "react-native";
import TabViewLibraryScreen from "../views/library/TabViewLibraryScreen";
import {Search} from "../views/search/Search";
import {Account} from "../views/account/Account";
import {AppColors} from "../theme/AppTheme";
import {useEffect} from "react";
import {UseUserLocalStorage} from "../hooks/UseUserLocalStorage";
import {useNavigation} from "@react-navigation/native";
import {PropsStackNavigation} from "../interfaces/StackNav";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {styles} from "react-native-toast-message/lib/src/components/BaseToast.styles";
import App from "../../../App";
import { useTheme } from "../provider/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialBottomTabNavigator();

export function UserNavigation ({navigation = useNavigation()}: PropsStackNavigation) {
    const { colors } = useTheme();
    const style = stylesTabBarItems(colors);
    const insets = useSafeAreaInsets();  

    const tabBarHeight = Platform.OS === "ios" 
    ? hp("10%") 
    : hp("8%") + insets.bottom; 

    
    return (
        <Tab.Navigator
            initialRouteName="Home"
            shifting={true}
            activeColor={colors.white}
            activeIndicatorStyle={{backgroundColor: colors.secondaryColor}}
            inactiveColor={colors.buttonBackground}
            barStyle={{ backgroundColor: colors.buttonBackground, height: tabBarHeight, zIndex: 8 }}
        >
            <Tab.Screen name="Home" options={{title:"Swipes",
                tabBarIcon: ({color})=>(
                    <Ionicons name="home-outline" size={22} color={colors.white} />
                )}}
                        component={Home} />
            <Tab.Screen name="Library" options={{title:"Library",
                tabBarIcon: ({color})=>(
                    <Ionicons name="heart-outline" size={22} color={colors.white} />
                )}}
                        component={TabViewLibraryScreen} />
            <Tab.Screen name="Search" options={{title:"Search",
                tabBarIcon: ({color})=>(
                    <Ionicons name="search-outline" size={22} color={colors.white} />
                )}}
                        component={Search} />
            <Tab.Screen name="Account" options={{title:"Account",
                tabBarIcon: ({color})=>(
                    <Ionicons name="person-outline" size={20} color={colors.white} />
                )}}
                        component={Account} />
        </Tab.Navigator>
    )
}

export const stylesTabBarItems = (colors: any) => StyleSheet.create({
    item: {
        width:wp("4.8%"),
        height:hp("3%"),
        resizeMode:"contain",
        tintColor:colors.white,
    }
})