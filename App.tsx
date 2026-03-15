import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {useFonts} from "expo-font";
import {UserNavigation} from "./app/presentation/navigation/UserNavigation";
import {GameDetails} from "./app/presentation/views/details/GameDetails";
import {CompanyDetails} from "./app/presentation/views/details/CompanyDetails";
import {UserDetails} from "./app/presentation/views/details/UserDetails";
import {GetSearchUserInterface} from "./app/domain/entities/User";
import {UseUserLocalStorage} from "./app/presentation/hooks/UseUserLocalStorage";
import {useEffect, useState} from "react";
import * as SplashScreen from "expo-splash-screen";
import {queryClient} from "./app/data/sources/local/QueyClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {GameProvider} from "./app/presentation/provider/GameProvider";
import {ActivityIndicator, Platform, Pressable, View} from "react-native";
import {WelcomeScreen} from "./app/presentation/views/auth/WelcomeScreen";
import {EmailScreen} from "./app/presentation/views/auth/EmailScreen";
import {PasswordScreen} from "./app/presentation/views/auth/PasswordScreen";
import {UserInfoAuthProvider} from "./app/presentation/provider/UserInfoAuthProvider";
import {UsernameScreen} from "./app/presentation/views/auth/UsernameScreen";
import { SettingsScreen } from "./app/presentation/views/settings/SettingsScreen";
import { ThemeScreen } from "./app/presentation/views/settings/ThemeScreen";
import { ThemeProvider, useTheme } from "./app/presentation/provider/ThemeProvider";
import { TutorialScreen } from "./app/presentation/views/tutorial/TutorialScreen";
import * as Network from 'expo-network';
import { Text } from "./app/presentation/components/Text";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundedButton } from "./app/presentation/components/RoundedButton";
import { Ionicons } from "@expo/vector-icons";



let mobileAds: any = null;
try {
    mobileAds = require('react-native-google-mobile-ads').default;
} catch (error) {}

export type RootStackParamsList = {
    UserNavigation: undefined;
    WelcomeScreen: undefined;
    GameDetails: {gameId: number, likeButton: boolean};
    CompanyDetails: {companyId: number}
    UserDetails: {userSearch: GetSearchUserInterface};
    EmailScreen: undefined
    PasswordScreen: undefined
    UsernameScreen: undefined
    SettingsScreen: undefined
    ThemeScreen: undefined
    TutorialScreen: {firstTime?: boolean}
}

const Stack = createStackNavigator<RootStackParamsList>();

function AppContent() {
    const {
        user,
    } = UseUserLocalStorage()

    const { colors } = useTheme();

    const [loading, setLoading] = useState(false);

    const customBackgroundTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.backgroundColor } };

    const [isWifi, setIsWifi] = useState(false);
    const checkWifi = async () => {
        const state = await Network.getNetworkStateAsync();
        setIsWifi(
               state.isConnected === true && 
               state.type === Network.NetworkStateType.WIFI
        );
    }

    useEffect(() => {
       checkWifi();
    }, []);

    if (!isWifi) {
        if (loading) {
            return (
                <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color={colors.white} />
                </View>
            )
        }
        return (
            <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: wp("6%")}}>No internet connection</Text>
                <Text style={{fontSize: wp("3.5%"),fontWeight: "300", marginTop: 10}}>Check your connection and try again</Text>
                <Pressable 
                onPress={() => {
                    setLoading(true);
                    setTimeout(() => {
                        checkWifi()
                        setLoading(false);
                    }, 1000);
                  
                }} 
                style={{marginTop: 20}}>
                    <Ionicons name="refresh" size={24} color="white" />
                </Pressable>
            </View>
        )
    }

    if (user === undefined) return null;
    return (
        <NavigationContainer theme={customBackgroundTheme}>
          <Stack.Navigator
              initialRouteName={user && user.slug ? "UserNavigation" : "WelcomeScreen"}
              screenOptions={{
                  headerShown: false,
                  detachPreviousScreen: true,
                  gestureEnabled: Platform.OS !== 'android',
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
              <Stack.Screen name="EmailScreen" component={EmailScreen}/>
              <Stack.Screen name="PasswordScreen" component={PasswordScreen}/>
              <Stack.Screen name="UsernameScreen" component={UsernameScreen}/>
              <Stack.Screen name="UserNavigation" component={UserNavigation}/>
              <Stack.Screen name="GameDetails" component={GameDetails}/>
              <Stack.Screen name="CompanyDetails" component={CompanyDetails}/>
              <Stack.Screen name="UserDetails" component={UserDetails}/>
              <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
              <Stack.Screen name="ThemeScreen" component={ThemeScreen}/>
              <Stack.Screen name="TutorialScreen" component={TutorialScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
    )
}


export default function App() {

    useEffect(() => {
        if (!mobileAds) {
            return;
        }
        mobileAds()
        .initialize()
        .then((adapterStatuses: any) => {
            console.log('AdMob initialized:', adapterStatuses);
        })
        .catch((error: any) => {
            console.error('AdMob initialization failed:', error);
        });
    }, []);

    const [fontsLoaded] = useFonts({
        "zen_kaku_light": require("./assets/fonts/zen_kaku_gothic_antique_light.ttf"),
        "zen_kaku_medium": require("./assets/fonts/zen_kaku_gothic_antique_medium.ttf"),
        "zen_kaku_regular": require("./assets/fonts/zen_kaku_gothic_antique_regular.ttf"),
        "zen_kaku_bold": require("./assets/fonts/zen_kaku_gothic_antique_bold.ttf"),
        "zen_kaku_black": require("./assets/fonts/zen_kaku_gothic_antique_black.ttf"),
    });

    SplashScreen.preventAutoHideAsync()

    useEffect(() => {
        try {
            SplashScreen.hideAsync();
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
        <GameProvider>
        <UserInfoAuthProvider>
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
        </UserInfoAuthProvider>
        </GameProvider>
        </QueryClientProvider>
  );
}


