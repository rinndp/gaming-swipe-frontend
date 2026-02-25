import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import {Text} from "../../components/Text";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import {styleGameDetails, styleSimilarGame} from "./StyleGameDetails";
import {AppColors} from "../../theme/AppTheme";
import stylesHome from "../home/StyleHome";
import styleHome from "../home/StyleHome";
import React, {useCallback, useEffect} from "react";
import {userDetailsViewModel} from "./ViewModel";
import {RootStackParamsList} from "../../../../App";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {stylesProfilePicture} from "../account/Account";
import {SimilarGame} from "../../../domain/entities/Game";
import {FavGame} from "../../../domain/entities/FavGame";
import {styleSearch} from "../search/StyleSearch";
import {API_BASE_URL, ApiDelivery} from "../../../data/sources/remote/api/ApiDelivery";
import {FlashList} from "@shopify/flash-list";
import Animated, {FadeInDown, FadeInLeft} from "react-native-reanimated";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {homeViewModel} from "../home/ViewModel";
import {HorizontalFlashList} from "../../components/HorizontalFlashList";
import { useTheme } from "../../theme/ThemeContext";

type GameDetailsRouteProp = RouteProp<RootStackParamsList, "UserDetails">;

export function UserDetails ({navigation = useNavigation()}: PropsStackNavigation,) {
    const route = useRoute<GameDetailsRouteProp>()
    const {userSearch} = route.params
    const { colors } = useTheme();
    const styleGD = styleGameDetails(colors);
    const styleSP = stylesProfilePicture(colors);

    const {
        showLoading,
        loadUserGames,
        favGames,
        playedGames,
        setShowLoading,
    } = userDetailsViewModel()

    useFocusEffect(
        useCallback(() => {
            if(userSearch.slug !== undefined)
                loadUserGames(userSearch.slug);
        }, [userSearch])
    );


    const favGameItem = useCallback(({item} : {item:FavGame}) => (
        <View style={{...styleSimilarGame(colors).card, backgroundColor: colors.buttonBackground}}>
            <TouchableOpacity onPress={() => {navigation.push("GameDetails", {gameId : item.id_api, likeButton: true})}}>
                <Image
                    source={{
                        uri: item.image_url
                            ? item.image_url
                            : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                    }}
                    style={styleSimilarGame(colors).image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame(colors).name}>{item.name}</Text>
        </View>
    ), [navigation])

    return(
        <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
            {!showLoading ? (
                <>
                    <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                        <View style={{alignItems:"center", paddingTop:hp("10%"), backgroundColor: colors.buttonBackground}}>
                            <TouchableOpacity
                                style={{...styleGD.goBackIcon, bottom: hp("4%"), end: wp("43%")}}
                                onPress={() => {
                                    setShowLoading(true)
                                    navigation.goBack()}}>
                                <Image source={require("../../../../assets/go-back-icon.png")}
                                       style={{...styleGD.goBackIcon}} />
                            </TouchableOpacity>
                            <View style={{width: wp("100%"), alignItems: "center"}}>
                                <Image source={userSearch.image ? {uri: `${userSearch.image}`} : require("../../../../assets/account-image.jpg")}
                                        style={styleSP.photo}
                                />
                            </View>
                            <Animated.View
                                entering={FadeInLeft.duration(800)}
                                style={{flex: 1}}>
                                <Text style={{...styleGD.name, height: "auto", lineHeight: 40, paddingBottom: hp("2%")}}>{userSearch?.username}</Text>
                            </Animated.View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={{paddingHorizontal: wp("3%"), paddingBottom: hp("4%")}}>
                            {favGames.length > 0 && (
                                <View>
                                    <Text style={{...styleGD.infoTitles, textAlign: "center"}}>Games to play</Text>
                                    <HorizontalFlashList data={favGames} renderItem={favGameItem} />
                                </View>
                            )}
                            {playedGames.length > 0 && (
                                <View>
                                    <Text style={{...styleGD.infoTitles, textAlign: "center", marginTop: wp("0%")}}>Played games</Text>
                                    <HorizontalFlashList data={playedGames} renderItem={favGameItem}/>
                                </View>
                            )}

                            {playedGames.length == 0 && favGames.length == 0 && (
                                <View>
                                    <Text style={{...styleSearch(colors).emptyFlatListText, fontSize: wp("3.8%"), textAlign: "center", margin: wp("4%")}}>Empty library</Text>
                                </View>
                            )}
                        </Animated.View>
                    </ScrollView>
                </>
            ) : (
                <ActivtyIndicatorCustom showLoading={showLoading}/>
            )}
        </View>
    )
}
