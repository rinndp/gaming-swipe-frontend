import {
    ImageBackground,
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity, FlatList, InteractionManager, ScrollView,
} from "react-native";
import stylesHome from "./StyleHome";
import {Text} from "../../components/Text"
import React, {useEffect, useState, useCallback, useRef} from "react";
import styleHome from "./StyleHome";
import viewModel from "./ViewModel";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {Game, Genre, GenreDTO, Platform} from "../../../domain/entities/Game";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {useNavigation} from "@react-navigation/native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Swiper, type SwiperCardRefType} from "rn-swiper-list";
import {GenreItem} from "../../components/GenreItem";
import {PlatformItem} from "../../components/PlatformItem";
import {NopeButton, stylesNopeButton} from "../../components/NopeButton";
import {LikeButton, stylesLikeButton} from "../../components/LikeButton";
import FilterButton, { DEFAULT_RATING } from "../../components/FilterButton";
import {RewindButton} from "../../components/RewindButton";
import {NO_GAMES_IMAGE_URL, NO_IMAGE_URL, transformCoverUrl} from "../../utils/TransformCoverUrls";
import {generateNoGamesFoundCard, NO_GAMES_FOUND_LABEL} from "../../utils/NoGameFoundWithThisFilters";
import {Image} from "expo-image"
import {HorizontalFlashList} from "../../components/HorizontalFlashList";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import { useTheme } from "../../provider/ThemeProvider";

function FiltroComponent(props: {
    onApply: (filters: { category: string | null; platform: string | null }) => Promise<void>,
    selectedGenre: string | null,
    selectedPlatform: string | null
}) {
    return null;
}

let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

try {
    const adsModule = require('react-native-google-mobile-ads');
    InterstitialAd = adsModule.InterstitialAd;
    AdEventType = adsModule.AdEventType;
    TestIds = adsModule.TestIds;
} catch (error) {
    console.log('📱 Running in Expo Go - Ads module not available');
}


export function Home({navigation = useNavigation()}: PropsStackNavigation) {

    const { colors, theme } = useTheme();
    const styleH = stylesHome(colors);

    const ADS_AVAILABLE = InterstitialAd !== null;
    const adUnitId = ADS_AVAILABLE ? TestIds?.INTERSTITIAL : '';

    const {
        listGames,
        setListGames,
        refillSwipeGames,
        showLoading,
        addGameToFav,
        selectedGenres,
        selectedPlatforms,
        refillSwipeGamesWithFilters,
        transformGameIntoFavGameInterface,
        getSimilarGamesFromGame,
        setSelectedRating,
        selectedRating,
        userLikedSimilarGames,
        setUserLikedSimilarGames,
    } = viewModel.homeViewModel()

    const {user} = UseUserLocalStorage()

    const nullGenre: Genre = {name : "No genres"}
    const nullPlatform: Platform = {name : "No platforms"}

    useEffect(() => {
        refillSwipeGames()
    }, [])

    const [showAdCounter, setShowAdCounter] = useState(0);
    const [adLoaded, setAdLoaded] = useState(false);
    const [interstitial, setInterstitial] = useState<any | null>(null);

    useEffect(() => {
        if (!ADS_AVAILABLE) {
            return;
        }
        const ad = InterstitialAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });
    
        const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
            console.log('✅ Ad loaded successfully');
            setAdLoaded(true);
        });
    
        const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error: any) => {
            console.log('❌ Ad failed to load:', error);
            setAdLoaded(false);
        });
    
        const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
            console.log('Ad closed, reloading...');
            setAdLoaded(false);
            ad.load();
        });
    
        ad.load();
        setInterstitial(ad);
    
        return () => {
            unsubscribeLoaded();
            unsubscribeError();
            unsubscribeClosed();
        };
    }, []);

    const showAd = () => {
        if (!ADS_AVAILABLE) {
            return;
        }
        
        if (adLoaded && interstitial) {
            console.log('Showing ad...');
            interstitial.show();
        } else {
            console.log('⚠️ Ad not ready yet, skipping...');
        }
    };


    const renderCard = useCallback((item: Game) => {
        return (
            <View style={{width: "100%", height:"100%"}}>
                <TouchableOpacity onPress={() => item.name !== NO_GAMES_FOUND_LABEL ? navigation.navigate("GameDetails", {gameId : item.id, likeButton: false}) : {}}>
                    <Image
                        source={{
                            uri: item.cover
                                ? transformCoverUrl(item.cover.url)
                                : (item.name === NO_GAMES_FOUND_LABEL ? NO_GAMES_IMAGE_URL : NO_IMAGE_URL),
                        }}
                        priority={"high"}
                        contentFit={"cover"}
                        placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}  // ← Hash del blur
                        transition={150}
                        style={styleH.image}
                    />
                </TouchableOpacity>
                <View style={{marginVertical: hp("1%"), paddingHorizontal: wp("5%")}}>
                    <View style={styleH.firstRowCardContainer}>
                        <Text style={styleH.gameNameText}> {item.name}</Text>
                        <View style={styleH.ratingContainer}>
                        <Text
                            style={styleH.ratingText}>{
                            item.rating
                                ? (item.rating === 100 ? item.rating : item.rating.toFixed(1))
                                : "N/A"
                        }</Text>
                        </View>
                    </View>
                    <View style={{marginTop: hp("1%")}} collapsable={false}>
                        <FlatList
                            data={item.platforms ? item.platforms : [nullPlatform]}
                            renderItem={({item}: {item: Platform}) => PlatformItem({item, colors: colors, home: true, theme: theme})}
                            keyExtractor={(item: Platform) => item.id?.toString() || ""}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}
                        />
                    </View>
                    <View style={styleH.thirdRowCardContainer} collapsable={false}>
                        <HorizontalFlashList data={item.genres ? item.genres : [nullGenre]}
                                             renderItem={({item}: {item: Genre}) => GenreItem({item, colors: colors, home: true, theme: theme})}
                                             style={{width: "83%"}}
                        />
                        <Text
                            style={styleH.releaseDateText}>{item.release_dates ? item.release_dates[0].y : "TBD"}</Text>
                    </View>
                </View>
            </View>
        );
    }, [colors, theme, navigation, styleH, nullGenre, nullPlatform]);


    const ref = useRef<SwiperCardRefType>(null);

    const OverlayRight = () => {
        return (
            <View
                style={[
                    styleH.overlayLabelContainer,
                    {
                        backgroundColor: colors.like,
                        opacity: 0.8
                    },
                ]}
            >
                <Text style={styleH.overlayLabelText}>Like</Text>
            </View>
        );
    };
    const OverlayLeft = () => {
        return (
            <View
                style={[
                    styleH.overlayLabelContainer,
                    {
                        backgroundColor: colors.nope,
                        opacity: 0.8,
                    },
                ]}
            >
                <Text style={styleH.overlayLabelText}>Nope</Text>
            </View>
        );
    };

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
            {showLoading ? (
                <>
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                </>
            ):(
                <>
                    <GestureHandlerRootView style={styleH.cardContainer}>
                        <Swiper
                            ref={ref}
                            data={listGames}
                            cardStyle={styleH.cardStyle}
                            overlayLabelContainerStyle={styleH.overlayLabelContainer}
                            swipeVelocityThreshold={1000}
                            prerenderItems={3}
                            
                            renderCard={renderCard}
                            disableTopSwipe={true}
                            disableBottomSwipe={true}
                            onIndexChange={async (index) => {
                                console.log('Current Active index', index, listGames.length);
                            }}
                            onSwipeRight={async (cardIndex) => {
                                if (user?.slug !== undefined && listGames[cardIndex].name !== NO_GAMES_FOUND_LABEL) {
                                    addGameToFav(transformGameIntoFavGameInterface(listGames[cardIndex]), user.slug)
                                    
                                    if (selectedGenres.length === 0 && selectedPlatforms.length === 0) {
                                        setTimeout(async () => {
                                            try {
                                                const similarGames = await getSimilarGamesFromGame(listGames[cardIndex].id);
                                                const existingGameIds = new Set(listGames.map(game => game.id));
                                                const newSimilarGames = similarGames[0].similar_games.filter(
                                                    game => !existingGameIds.has(game.id)
                                                );
                                                if (newSimilarGames.length > 0) {
                                                    setUserLikedSimilarGames((prevGames) => [...prevGames, ...newSimilarGames]);
                                                }
                                            } catch (error) {
                                                console.log('Error loading similar games:', error);
                                            }
                                        }, 500); 
                                    }
                                }
                            }}
                            onSwipeLeft={(cardIndex) => {
                            }}
                            onSwipedAll={() => {
                                setShowAdCounter((prev) => {
                                    const newCount = prev + 1;
                                
                                    setTimeout(async () => {
                                        if (newCount === 2) {
                                            showAd();
                                            setShowAdCounter(0);
                                        }
                                        
                                        if (selectedGenres.length === 0 && selectedPlatforms.length === 0 && selectedRating === DEFAULT_RATING) {
                                            await refillSwipeGames()
                                        } else {
                                            const filters = {
                                                genres: selectedGenres,
                                                platforms: selectedPlatforms,
                                                rating: selectedRating,
                                            }
                                            await refillSwipeGamesWithFilters(filters);
                                        }
                                    }, 350);
                                    
                                    return newCount === 2 ? 0 : newCount;
                                });
                            }}
                            OverlayLabelRight={OverlayRight}
                            OverlayLabelLeft={OverlayLeft}
                        />
                    </GestureHandlerRootView>
                    <View style={styleH.buttonsContainer}>
                        <View style={{marginTop: hp("1%")}}>
                            <NopeButton onPress={() =>  ref.current?.swipeLeft()}></NopeButton>
                        </View>
                        <View style={{gap:hp("2%"), alignItems: "center"}}>
                            <RewindButton onPress={() =>  ref.current?.swipeBack()}></RewindButton>
                            <FilterButton onApply={refillSwipeGamesWithFilters} selectedGenre={selectedGenres} selectedPlatform={selectedPlatforms} selectedRating={selectedRating}  />
                        </View>
                        <View style={{marginTop: hp("1%")}}>
                            <LikeButton onPress={() => ref.current?.swipeRight()}></LikeButton>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}