import {
    ActivityIndicator, Animated as Ani,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity, useWindowDimensions,
    View
} from "react-native";
import {Image, ImageSource} from "expo-image"
import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamsList} from "../../../../App";
import styleHome from "../home/StyleHome";
import React, {useCallback, useEffect, useRef, useState} from "react";
import viewModelHome, {homeViewModel} from "../home/ViewModel"
import stylesHome from "../home/StyleHome";
import {styles} from "react-native-toast-message/lib/src/components/BaseToast.styles";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {PlatformItem} from "../../components/PlatformItem";
import {Cover, Game, GameDetailsInterface, Genre, Platform, SimilarGame} from "../../../domain/entities/Game";
import {GenreItem} from "../../components/GenreItem";
import YoutubePlayer from "react-native-youtube-iframe";
import {styleGameDetails, styleSimilarGame} from "./StyleGameDetails";
import Toast from "react-native-toast-message";
import viewModelFav from "../fav/ViewModel";
import {styleSearch, styleSearchGameItem} from "../search/StyleSearch";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {AppColors} from "../../theme/AppTheme";
import {FlashList} from "@shopify/flash-list";
import {
    NO_IMAGE_URL,
    transformBig2xCoverUrl,
    transformCoverUrl,
    transformSmallCoverUrl
} from "../../utils/TransformCoverUrls";
import {HorizontalFlashList} from "../../components/HorizontalFlashList";
import PagerView from "react-native-pager-view";
import stylesAuthViews from "../auth/StylesAuthViews";
import {useGameDetails} from "../../hooks/UseGameDetails";
import {ExpandingDot} from "react-native-animated-pagination-dots";
import Animated, {FadeInDown, FadeInLeft, FadeInRight, FadeInUp, SlideInDown} from 'react-native-reanimated';
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {useUserGamesContext} from "../../provider/GameProvider";

type GameDetailsRouteProp = RouteProp<RootStackParamsList, "GameDetails">;

export const filledHeartSource = require("../../../../assets/filled-heart.png")
export const checkIconSource = require("../../../../assets/check-icon.png")
export const heartSource = require("../../../../assets/heart.png")


export function GameDetails({navigation = useNavigation()}: PropsStackNavigation) {
    const {user} = UseUserLocalStorage()
    const [showLoading, setShowLoading] = useState(true);
    let [likeButtonImageSource, setLikeButtonImageSource] = useState<ImageSource>()

    const {
        addGameToFav,
        transformGameIntoFavGameInterface,
    } = viewModelHome.homeViewModel()

    const {
        deleteGameFromFav,
        loadFavGames,
        loadPlayedGames,
    } = viewModelFav.favScreenViewModel()

    const {favListGames, playedListGames} = useUserGamesContext()

    const checkIfGameFromApiIsLiked = (gameId: number) => {
        return favListGames.some(game => game.id_api === gameId);
    }

    const checkIfGameFromApiIsPlayed = (gameId: number) => {
        return playedListGames.some(game => game.id_api === gameId);
    }

    //Getting params from route
    const route = useRoute<GameDetailsRouteProp>()
    const {gameId} = route.params
    const {likeButton} = route.params

    useEffect(() => {
        if (checkIfGameFromApiIsLiked(gameId))
            setLikeButtonImageSource(filledHeartSource)
        else if (checkIfGameFromApiIsPlayed(gameId))
            setLikeButtonImageSource(checkIconSource)
        else
            setLikeButtonImageSource(heartSource)
    }, [favListGames, playedListGames, gameId]);

    //Using React Query to load game details and saving it in the cache
    const {data, isLoading, error} = useGameDetails(gameId);
    const gameDetails = data ? data[0] : undefined;

    //Null objects
    const nullGenre: Genre = {name : "No genres registered"}
    const nullPlatform: Platform = {name : "No platforms registered"}

    const similarGameItem = useCallback(({item} : {item:SimilarGame}) => (
        <View style={styleSimilarGame.card}>
            <TouchableOpacity onPress={() => {navigation.push("GameDetails", {gameId : item.id, likeButton: true})}}>
                <Image
                    source={{
                        uri: item.cover
                            ? transformSmallCoverUrl(item.cover.url)
                            : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                    }}
                    contentFit="cover"
                    placeholder={NO_IMAGE_URL}
                    cachePolicy={"memory-disk"}
                    style={styleSimilarGame.image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame.name}>{item.name}</Text>
        </View>
        ), [navigation])


    useEffect(() => {
        if (!isLoading) {
            const timeout = setTimeout(() => {
                setShowLoading(false);
            }, 200);
            return () => clearTimeout(timeout);
        } else {
            setShowLoading(true);
        }
    }, [isLoading]);

    const scrollX = React.useRef(new Ani.Value(0)).current;


    return(
            <View style={{width: '100%', height: '100%',
                backgroundColor: showLoading ? AppColors.backgroundColor : AppColors.buttonBackground}}>
                {!showLoading ? (
                    <>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        <View style={{...styleSearch.logoContainer, position:"absolute", zIndex:99}}>
                            <Image transition={100} priority={"high"}
                                   cachePolicy={"memory-disk"}
                                   source={require("../../../../assets/igdb-logo.webp")} style={styleSearch.logo} />
                        </View>
                        <View style={styleGameDetails.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styleGameDetails.goBackIconTouchable}>
                                <Image source={require("../../../../assets/go-back-icon.png")}
                                       cachePolicy={"memory-disk"}
                                       contentFit={"contain"}
                                       style={styleGameDetails.goBackIcon}/>
                            </TouchableOpacity>
                            <Image
                                source={{
                                    uri: gameDetails?.cover
                                        ? transformBig2xCoverUrl(gameDetails.cover.url)
                                        : NO_IMAGE_URL,
                                }}
                                contentFit="contain"
                                priority={"high"}
                                transition={350}
                                cachePolicy={"memory-disk"}
                                style={styleGameDetails.image}
                            />
                            <Animated.View
                                entering={FadeInRight.duration(800)}
                                style={{flex: 2}}>
                                <Text style={styleGameDetails.name}>{gameDetails?.name}</Text>
                                <View style={{flexDirection: "row", gap: wp("11%")}}>
                                    <Text style={styleGameDetails.rating}>{gameDetails?.rating ? gameDetails?.rating.toFixed(1) : "No rate"}</Text>
                                    <Text style={styleGameDetails.rating}>{gameDetails?.release_dates ? (gameDetails?.release_dates[0].y ? gameDetails?.release_dates[0].y : "TBD") : "TBD"}</Text>
                                </View>
                            </Animated.View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={{paddingHorizontal:wp("4%"), backgroundColor: AppColors.backgroundColor}}>
                            <View style={{flexDirection: "row", gap:wp("36%")}}>
                                <Text style={styleGameDetails.infoTitles}>Involved companies</Text>
                                {likeButton && (
                                <TouchableOpacity onPress={async () => {
                                    if (!checkIfGameFromApiIsLiked(gameDetails?.id || 0)) {
                                        try {
                                            if (!checkIfGameFromApiIsPlayed(gameDetails?.id || 0)) {
                                                await addGameToFav(transformGameIntoFavGameInterface(gameDetails), user?.slug || "");
                                                setLikeButtonImageSource(filledHeartSource)
                                                await loadFavGames(user?.slug || "")
                                            }
                                        } catch (error) {
                                            Toast.show({
                                                "type": "error",
                                                "text1": "Error while trying to save the game",
                                            })
                                        }
                                    } else {
                                        try {
                                            await deleteGameFromFav(
                                                gameDetails ? gameDetails?.id : 0,
                                                user?.slug ? user?.slug : "",
                                            );
                                            setLikeButtonImageSource(heartSource)
                                            await loadFavGames(user?.slug ? user?.slug : "")

                                        } catch (error) {
                                            Toast.show({
                                                "type": "error",
                                                "text1": "Error while trying to delete game",
                                            })
                                        }
                                    }
                                }}>
                                    <Image
                                        contentFit={"contain"}
                                        cachePolicy={"memory-disk"}
                                        priority={"high"}
                                        style={styleGameDetails.fav} source={likeButtonImageSource}/>
                                </TouchableOpacity>
                            )}
                            </View>
                            <FlashList
                                data={gameDetails?.involved_companies}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={{flexDirection: "row", alignSelf:"flex-start", alignItems:"center", gap:wp("3%")}} onPress={() => navigation.push("CompanyDetails", {companyId: item.company.id})}>
                                        <Text style={styleGameDetails.involvedCompany}>{item.company.name}</Text>
                                        <Image priority={"high"}
                                               cachePolicy={"memory-disk"}
                                               source={require("../../../../assets/url-icon.png")}
                                        style={{width: wp("3.5%"), height: hp("1.6%"), tintColor: AppColors.white}}/>
                                    </TouchableOpacity>
                                )}/>

                            <Text style={styleGameDetails.infoTitles}>Platforms</Text>
                            <HorizontalFlashList style={{width: wp("90%")}}
                                                 data={gameDetails?.platforms ? gameDetails?.platforms : [nullPlatform]}
                                                 renderItem={PlatformItem}
                            />
                            <Text style={styleGameDetails.infoTitles}>Genres</Text>
                            <HorizontalFlashList style={{width: wp("90%")}}
                                                 data={gameDetails?.genres ? gameDetails?.genres : [nullGenre]}
                                                 renderItem={GenreItem}
                            />
                            {gameDetails?.release_dates && (
                                <View>
                                    <Text style={styleGameDetails.infoTitles}>Release date</Text>
                                    <Text style={{...styleGameDetails.summary, lineHeight: 20}}>{gameDetails?.release_dates[0].human}</Text>
                                </View>
                            )}
                            <Text style={styleGameDetails.infoTitles}>Summary</Text>
                            <Text style={styleGameDetails.summary}>{gameDetails?.summary ? gameDetails?.summary : "--"}</Text>
                            {gameDetails?.storyline && (
                                <View>
                                    <Text style={styleGameDetails.infoTitles}>Story line</Text>
                                    <Text style={styleGameDetails.summary}>{gameDetails?.storyline ? gameDetails?.storyline : "--"}</Text>
                                </View>
                            )}
                            {gameDetails?.screenshots && (
                                <View style={{marginTop: hp("4%")}}>
                                    <Animated.FlatList
                                        horizontal={true}
                                        data={gameDetails?.screenshots}
                                        pagingEnabled={true}
                                        snapToAlignment={"center"}
                                        style={{ width: wp("100%"), marginStart:wp("-4%"), marginHorizontal:wp("4%"), paddingEnd:wp("4%")}}
                                        showsHorizontalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                        renderItem={({ item }) => (
                                                <Image
                                                    style={{ width: wp("92%"), height: hp("25%"), marginHorizontal:wp("4%"), borderRadius:5}}
                                                    transition={250}
                                                    priority="normal"
                                                    cachePolicy="memory-disk"
                                                    source={{ uri: transformCoverUrl(item.url) }}
                                                />
                                        )}
                                        scrollEventThrottle={16}
                                        bounces={false}
                                        removeClippedSubviews={true}
                                        onScroll={Ani.event(
                                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                            {
                                                useNativeDriver: false,
                                            }
                                        )}
                                    >
                                    </Animated.FlatList>
                                        <ExpandingDot
                                            data={gameDetails.screenshots}
                                            expandingDotWidth={30}
                                            scrollX={scrollX}
                                            activeDotColor={AppColors.white}
                                            inActiveDotOpacity={0.4}
                                            inActiveDotColor="#fff"
                                            dotStyle={styleGameDetails.dot}
                                            containerStyle={{
                                                position: "relative",
                                                alignSelf: "center",
                                                marginTop: hp("4%"),
                                                marginBottom: hp("1%"),
                                                flexDirection: "row",
                                        }}
                                        />
                                </View>
                            )}
                            {gameDetails?.videos && (
                                <View style={{marginBottom: hp("-3%")}}>
                                    <YoutubePlayer
                                        height={250}
                                        videoId={gameDetails?.videos[0].video_id}
                                    />
                                </View>
                            )}

                            {gameDetails?.similar_games && (
                                <View style={{marginTop: hp("4%"), backgroundColor: AppColors.buttonBackground, marginHorizontal: wp("-4%"), paddingHorizontal: wp("4%")}}>
                                    <Text style={{...styleGameDetails.infoTitles, textAlign:"center"}}>Similar games</Text>
                                    <HorizontalFlashList data={gameDetails?.similar_games}
                                                         renderItem={similarGameItem}/>
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