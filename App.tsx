import {NavigationContainer} from "@react-navigation/native";
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {useFonts} from "expo-font";
import {UserNavigation} from "./app/presentation/navigation/UserNavigation";
import {Account} from "./app/presentation/views/account/Account";
import {GameDetails} from "./app/presentation/views/details/GameDetails";
import {Game} from "./app/domain/entities/Game";
import {CompanyDetails} from "./app/presentation/views/details/CompanyDetails";
import {UserDetails} from "./app/presentation/views/details/UserDetails";
import {GetSearchUserInterface} from "./app/domain/entities/User";
import {UseUserLocalStorage} from "./app/presentation/hooks/UseUserLocalStorage";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loadTokens} from "./app/data/sources/local/secure/TokenStorage";
import * as SplashScreen from "expo-splash-screen";
import {Asset} from "expo-asset";
import {queryClient} from "./app/data/sources/local/QueyClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {GameProvider} from "./app/presentation/provider/GameProvider";
import {Platform} from "react-native";
import {WelcomeScreen} from "./app/presentation/views/auth/WelcomeScreen";
import {EmailScreen} from "./app/presentation/views/auth/EmailScreen";
import {PasswordScreen} from "./app/presentation/views/auth/PasswordScreen";
import {UserInfoAuthProvider} from "./app/presentation/provider/UserInfoAuthProvider";
import {UsernameScreen} from "./app/presentation/views/auth/UsernameScreen";
import * as Updates from 'expo-updates';


export type RootStackParamsList = {
    UserNavigation: undefined;
    WelcomeScreen: undefined;
    GameDetails: {gameId: number, likeButton: boolean};
    CompanyDetails: {companyId: number}
    UserDetails: {userSearch: GetSearchUserInterface};
    EmailScreen: undefined
    PasswordScreen: undefined
    UsernameScreen: undefined
}

const Stack = createStackNavigator<RootStackParamsList>();

export default function App() {

    const [fontsLoaded] = useFonts({
        "zen_kaku_light": require("./assets/fonts/zen_kaku_gothic_antique_light.ttf"),
        "zen_kaku_medium": require("./assets/fonts/zen_kaku_gothic_antique_medium.ttf"),
        "zen_kaku_regular": require("./assets/fonts/zen_kaku_gothic_antique_regular.ttf"),
        "zen_kaku_bold": require("./assets/fonts/zen_kaku_gothic_antique_bold.ttf"),
        "zen_kaku_black": require("./assets/fonts/zen_kaku_gothic_antique_black.ttf"),
    });

    const {
        user,
    } = UseUserLocalStorage()


    SplashScreen.preventAutoHideAsync()

    useEffect(() => {
        try {
            SplashScreen.hideAsync();
        } catch (e) {
            console.log(e)
        }
    }, []);

    useEffect(() => {
        async function checkForUpdates() {
            if (__DEV__) return; // No ejecutar en desarrollo
            
            try {
                const update = await Updates.checkForUpdateAsync();
                
                if (update.isAvailable) {
                    console.log('📥 Update disponible, descargando...');
                    await Updates.fetchUpdateAsync();
                    console.log('✅ Update descargado, aplicando...');
                    await Updates.reloadAsync();
                }
            } catch (error) {
                console.error('Error al verificar updates:', error);
            }
        }
        
        checkForUpdates();
    }, []);

    if (user === undefined) return null;
    return (
        <QueryClientProvider client={queryClient}>
        <GameProvider>
        <UserInfoAuthProvider>
        <NavigationContainer>
          <Stack.Navigator
              initialRouteName={user && user.slug ? "UserNavigation" : "WelcomeScreen"}
              screenOptions={{
                  headerShown: false,
                  detachPreviousScreen: false,
                  gestureEnabled: Platform.OS !== 'android',
                  cardStyleInterpolator: Platform.OS === "android" ? CardStyleInterpolators.forFadeFromBottomAndroid : CardStyleInterpolators.forHorizontalIOS}}>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
              <Stack.Screen name="EmailScreen" component={EmailScreen}/>
              <Stack.Screen name="PasswordScreen" component={PasswordScreen}/>
              <Stack.Screen name="UsernameScreen" component={UsernameScreen}/>
              <Stack.Screen name="UserNavigation" component={UserNavigation}/>
              <Stack.Screen name="GameDetails" component={GameDetails}/>
              <Stack.Screen name="CompanyDetails" component={CompanyDetails}/>
              <Stack.Screen name="UserDetails" component={UserDetails}/>
          </Stack.Navigator>
        </NavigationContainer>
        </UserInfoAuthProvider>
        </GameProvider>
        </QueryClientProvider>
  );
}


