import {
    Animated as Ani,
    ScrollView,
    Platform as Plat,
    TouchableOpacity, useWindowDimensions,
    View
} from "react-native";
import {Text} from "../../components/Text";
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
import viewModelFav from "../library/ViewModel";
import {styleSearch} from "../search/StyleSearch";
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
import {useGameDetails} from "../../hooks/UseGameDetails";
import {ExpandingDot} from "react-native-animated-pagination-dots";
import Animated, {FadeInDown, FadeInLeft, FadeInRight, FadeInUp, SlideInDown} from 'react-native-reanimated';
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import { HandleLikeButton } from "../../components/HandleLikeButton";
import { useTheme } from "../../theme/ThemeContext";

type GameDetailsRouteProp = RouteProp<RootStackParamsList, "GameDetails">;

export function GameDetails({navigation = useNavigation()}: PropsStackNavigation) {
    const {user} = UseUserLocalStorage()
    const [showLoading, setShowLoading] = useState(true);
    const { colors } = useTheme();
    const style = styleGameDetails(colors);
    const {
        transformGameIntoFavGameInterface,
    } = viewModelHome.homeViewModel()

    const {
        loadFavGames,
    } = viewModelFav.favScreenViewModel()

    //Getting params from route
    const route = useRoute<GameDetailsRouteProp>()
    const {gameId} = route.params
    const {likeButton} = route.params

    //Using React Query to load game details and saving it in the cache
    const {data, isLoading, error} = useGameDetails(gameId);
    const gameDetails = data ? data[0] : undefined;

    //Null objects
    const nullGenre: Genre = {name : "No genres registered"}
    const nullPlatform: Platform = {name : "No platforms registered"}

    const similarGameItem = useCallback(({item} : {item:SimilarGame}) => (
        <View style={styleSimilarGame(colors).card}>
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
                    style={styleSimilarGame(colors).image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame(colors).name}>{item.name}</Text>
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
                backgroundColor: showLoading ? colors.backgroundColor : colors.buttonBackground}}>
                {!showLoading ? (
                    <>
                    <ScrollView
                        removeClippedSubviews={true} 
                        nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        <View style={{...styleSearch(colors).logoContainer, position:"absolute", zIndex:99}}>
                            <Image transition={100} priority={"high"}
                                   cachePolicy={"memory-disk"}
                                   source={require("../../../../assets/igdb-logo.webp")} style={styleSearch(colors).logo} />
                        </View>
                        <View style={style.header}>
                            <TouchableOpacity 
                                onPress={() => {
                                    setShowLoading(true)
                                    navigation.goBack()
                                    }}
                                style={style.goBackIconTouchable}>
                                <Image source={require("../../../../assets/go-back-icon.png")}
                                       cachePolicy={"memory-disk"}
                                       contentFit={"contain"}
                                       style={style.goBackIcon}/>
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
                                style={style.image}
                            />
                            <Animated.View
                                entering={FadeInRight.duration(800)}
                                style={{flex: 2}}>
                                <Text style={style.name}>{gameDetails?.name}</Text>
                                <View style={{flexDirection: "row", gap: wp("11%")}}>
                                    <Text style={style.rating}>{gameDetails?.rating ? gameDetails?.rating.toFixed(1) : "No rate"}</Text>
                                    <Text style={style.rating}>{gameDetails?.release_dates ? (gameDetails?.release_dates[0].y ? gameDetails?.release_dates[0].y : "TBD") : "TBD"}</Text>
                                </View>
                            </Animated.View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={{paddingHorizontal:wp("4%"), backgroundColor: colors.backgroundColor}}>
                            <View style={{flexDirection: "row", gap:wp("36%")}}>
                                <Text style={style.infoTitles}>Involved companies</Text>
                                {likeButton && (
                                    <View style={{justifyContent: "center"}}>
                                    <HandleLikeButton 
                                            game={transformGameIntoFavGameInterface(gameDetails)}
                                            loadFavGames={() => loadFavGames(user?.slug || "")}
                                        />
                                    </View>
                            )}
                            </View>
                            <FlashList
                                data={gameDetails?.involved_companies}
                                scrollEnabled={false}
                                ListEmptyComponent={<Text style={{...style.summary, color: colors.red}}>No involved companies registered</Text>}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={{flexDirection: "row", alignSelf:"flex-start", alignItems:"center", gap:wp("3%")}} onPress={() => navigation.push("CompanyDetails", {companyId: item.company.id})}>
                                        <Text style={style.involvedCompany}>{item.company.name}</Text>
                                        <Image priority={"high"}
                                               cachePolicy={"memory-disk"}
                                               source={require("../../../../assets/url-icon.png")}
                                        style={{width: wp("3.5%"), height: hp("1.6%"), tintColor: colors.white}}/>
                                    </TouchableOpacity>
                                )}/>

                            <Text style={style.infoTitles}>Platforms</Text>
                            <HorizontalFlashList style={{width: wp("90%")}}
                                                 data={gameDetails?.platforms ? gameDetails?.platforms : [nullPlatform]}
                                                 renderItem={({item}: {item: Platform}) => PlatformItem({item, colors: colors})}
                            />
                            <Text style={style.infoTitles}>Genres</Text>
                            <HorizontalFlashList style={{width: wp("90%")}}
                                                 data={gameDetails?.genres ? gameDetails?.genres : [nullGenre]}
                                                 renderItem={({item}: {item: Genre}) => GenreItem({item, colors: colors})}
                            />
                            {gameDetails?.release_dates && (
                                <View>
                                    <Text style={style.infoTitles}>Release date</Text>
                                    <Text style={{...style.summary, lineHeight: 20}}>{gameDetails?.release_dates[0].human}</Text>
                                </View>
                            )}
                            <Text style={style.infoTitles}>Summary</Text>
                            <Text style={style.summary}>{gameDetails?.summary ? gameDetails?.summary : "--"}</Text>
                            {gameDetails?.storyline && (
                                <View>
                                    <Text style={style.infoTitles}>Story line</Text>
                                    <Text style={style.summary}>{gameDetails?.storyline ? gameDetails?.storyline : "--"}</Text>
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
                                            activeDotColor={colors.white}
                                            inActiveDotOpacity={0.4}
                                            inActiveDotColor={colors.gray}
                                            dotStyle={style.dot}
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
                                <View style={{marginTop: hp("4%"), paddingBottom: Plat.OS === "android" ? hp("2%") : hp("0%"), backgroundColor: colors.buttonBackground, marginHorizontal: wp("-4%"), paddingHorizontal: wp("4%"), elevation: 14, zIndex: 2}}>
                                    <Text style={{...style.infoTitles, textAlign:"center"}}>Similar games</Text>
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