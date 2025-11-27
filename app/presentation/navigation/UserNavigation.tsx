import {Home} from "../views/home/Home";
import {Image, Platform, StyleSheet} from "react-native";
import TabViewFavScreen from "../views/fav/TabViewFavScreen";
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

const Tab = createMaterialBottomTabNavigator();

export function UserNavigation ({navigation = useNavigation()}: PropsStackNavigation) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            shifting={true}
            activeIndicatorStyle={{backgroundColor: AppColors.secondaryColor}}
            activeColor={AppColors.white}
            inactiveColor={AppColors.buttonBackground}
            barStyle={{ backgroundColor: AppColors.buttonBackground, height: Platform.OS === "ios" ? hp("10%") : hp("13.5%"), zIndex: 8 }}
        >
            <Tab.Screen name="Home" options={{title:"Swipes",
                tabBarIcon: ({color})=>(
                    <Image
                        source={require("../../../assets/home-icon.png")}
                        style={stylesTabBarItems.item}/>
                )}}
                        component={Home} />
            <Tab.Screen name="Fav" options={{title:"Library",
                tabBarIcon: ({color})=>(
                    <Image
                        source={require("../../../assets/heart.png")}
                        style={stylesTabBarItems.item}/>
                )}}
                        component={TabViewFavScreen} />
            <Tab.Screen name="Search" options={{title:"Search",
                tabBarIcon: ({color})=>(
                    <Image
                        source={require("../../../assets/search.png")}
                        style={stylesTabBarItems.item}/>
                )}}
                        component={Search} />
            <Tab.Screen name="Account" options={{title:"Account",
                tabBarIcon: ({color})=>(
                    <Image
                        source={require("../../../assets/account.png")}
                        style={stylesTabBarItems.item}/>
                )}}
                        component={Account} />
        </Tab.Navigator>
    )
}

export const stylesTabBarItems = StyleSheet.create({
    item: {
        width:wp("4.8%"),
        height:hp("3%"),
        resizeMode:"contain",
        tintColor:AppColors.white,
    }
})