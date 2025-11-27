import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
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

type GameDetailsRouteProp = RouteProp<RootStackParamsList, "UserDetails">;

export function UserDetails ({navigation = useNavigation()}: PropsStackNavigation,) {
    const route = useRoute<GameDetailsRouteProp>()
    const {userSearch} = route.params

    const {
        showLoading,
        loadUserGames,
        favGames,
        playedGames,
    } = userDetailsViewModel()

    useFocusEffect(
        useCallback(() => {
            if(userSearch.slug !== undefined)
                loadUserGames(userSearch.slug);
        }, [userSearch])
    );


    const favGameItem = useCallback(({item} : {item:FavGame}) => (
        <View style={{...styleSimilarGame.card, backgroundColor: AppColors.buttonBackground}}>
            <TouchableOpacity onPress={() => {navigation.push("GameDetails", {gameId : item.id_api, likeButton: true})}}>
                <Image
                    source={{
                        uri: item.image_url
                            ? item.image_url
                            : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                    }}
                    style={styleSimilarGame.image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame.name}>{item.name}</Text>
        </View>
    ), [navigation])

    return(
        <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
            {!showLoading ? (
                <>
                    <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                        <View style={{alignItems:"center", paddingTop:hp("10%"), backgroundColor: AppColors.buttonBackground}}>
                            <TouchableOpacity
                                style={{...styleGameDetails.goBackIcon, bottom: hp("4%"), end: wp("43%")}}
                                onPress={navigation.goBack}>
                                <Image source={require("../../../../assets/go-back-icon.png")}
                                       style={{...styleGameDetails.goBackIcon}} />
                            </TouchableOpacity>
                            <View style={{width: wp("100%"), alignItems: "center"}}>
                                <Image source={userSearch.image ? {uri: `${API_BASE_URL.slice(0, -4)}${userSearch.image}`} : require("../../../../assets/account-image.jpg")}
                                        style={stylesProfilePicture.photo}
                                />
                            </View>
                            <Animated.View
                                entering={FadeInLeft.duration(800)}
                                style={{flex: 1}}>
                                <Text style={{...styleGameDetails.name, height: "auto", lineHeight: 40, paddingBottom: hp("2%")}}>{userSearch?.username}</Text>
                            </Animated.View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={{paddingHorizontal: wp("3%")}}>
                            {favGames.length > 0 && (
                                <View>
                                    <Text style={{...styleGameDetails.infoTitles, textAlign: "center"}}>Favorites games</Text>
                                    <HorizontalFlashList data={favGames} renderItem={favGameItem} />
                                </View>
                            )}
                            {playedGames.length > 0 && (
                                <View>
                                    <Text style={{...styleGameDetails.infoTitles, textAlign: "center", marginTop: wp("0%")}}>Played games</Text>
                                    <HorizontalFlashList data={playedGames} renderItem={favGameItem}/>
                                </View>
                            )}

                            {playedGames.length == 0 && favGames.length == 0 && (
                                <View>
                                    <Text style={{...styleSearch.emptyFlatListText, fontSize: wp("3.8%"), textAlign: "center", margin: wp("4%")}}>Empty library</Text>
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
