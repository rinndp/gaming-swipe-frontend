import {
    ImageBackground,
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity, FlatList, InteractionManager, ScrollView,
} from "react-native";
import stylesHome from "./StyleHome";
import {Text} from "react-native"
import React, {useEffect, useState, useCallback, useRef} from "react";
import {CardItemHandle, TinderCard} from "rn-tinder-card";
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
import {AppColors} from "../../theme/AppTheme";
import {styles} from "react-native-toast-message/lib/src/components/BaseToast.styles";
import {GenreItem} from "../../components/GenreItem";
import {PlatformItem} from "../../components/PlatformItem";
import {NopeButton, stylesNopeButton} from "../../components/NopeButton";
import {LikeButton, stylesLikeButton} from "../../components/LikeButton";
import FilterButton from "../../components/FilterButton";
import {RewindButton} from "../../components/RewindButton";
import {NO_GAMES_IMAGE_URL, NO_IMAGE_URL, transformCoverUrl} from "../../utils/TransformCoverUrls";
import {generateNoGamesFoundCard, NO_GAMES_FOUND_LABEL} from "../../utils/NoGameFoundWithThisFilters";
import {Image} from "expo-image"
import {HorizontalFlashList} from "../../components/HorizontalFlashList";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";


function FiltroComponent(props: {
    onApply: (filters: { category: string | null; platform: string | null }) => Promise<void>,
    selectedGenre: string | null,
    selectedPlatform: string | null
}) {
    return null;
}

export function Home({navigation = useNavigation()}: PropsStackNavigation) {

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
        selectedRating
    } = viewModel.homeViewModel()

    const {user} = UseUserLocalStorage()

    const nullGenre: Genre = {name : "No genres"}
    const nullPlatform: Platform = {name : "No platforms"}

    useEffect(() => {
        refillSwipeGames()
    }, [])

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
                        transition={250}
                        style={styleHome.image}
                    />
                </TouchableOpacity>
                <View style={{marginVertical: hp("1%"), paddingHorizontal: wp("5%")}}>
                    <View style={stylesHome.firstRowCardContainer}>
                        <Text style={stylesHome.gameNameText}> {item.name}</Text>
                        <View style={stylesHome.ratingContainer}>
                        <Text
                            style={stylesHome.ratingText}>{
                            item.rating
                                ? (item.rating === 100 ? item.rating : item.rating.toFixed(1))
                                : "N/A"
                        }</Text>
                        </View>
                    </View>
                    <View style={{marginTop: hp("1%")}}>
                        <HorizontalFlashList data={item.platforms ? item.platforms : [nullPlatform]}
                                             renderItem={PlatformItem}/>
                    </View>
                    <View style={styleHome.thirdRowCardContainer}>
                        <HorizontalFlashList data={item.genres ? item.genres : [nullGenre]}
                                             renderItem={GenreItem}
                                             style={{width: "83%"}}
                        />
                        <Text
                            style={styleHome.releaseDateText}>{item.release_dates ? item.release_dates[0].y : "TBD"}</Text>
                    </View>
                </View>
            </View>
        );
    }, []);


    const ref = useRef<SwiperCardRefType>(null);

    const OverlayRight = () => {
        return (
            <View
                style={[
                    stylesHome.overlayLabelContainer,
                    {
                        backgroundColor: AppColors.like,
                        opacity: 0.8
                    },
                ]}
            >
                <Text style={stylesHome.overlayLabelText}>Like</Text>
            </View>
        );
    };
    const OverlayLeft = () => {
        return (
            <View
                style={[
                    stylesHome.overlayLabelContainer,
                    {
                        backgroundColor: AppColors.nope,
                        opacity: 0.8,
                    },
                ]}
            >
                <Text style={stylesHome.overlayLabelText}>Nope</Text>
            </View>
        );
    };

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
            {showLoading ? (
                <>
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                </>
            ):(
                <>
                    <GestureHandlerRootView style={styleHome.cardContainer}>
                        <Swiper
                            ref={ref}
                            data={listGames}
                            cardStyle={styleHome.cardStyle}
                            overlayLabelContainerStyle={styleHome.overlayLabelContainer}
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
                                                    setListGames((prevGames) => [...prevGames, ...newSimilarGames]);
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
                                setTimeout(async () => {
                                    if (selectedGenres.length === 0 && selectedPlatforms.length === 0 && selectedRating === 70) {
                                        await refillSwipeGames()
                                    } else {
                                        const filters = {
                                            genres: selectedGenres,
                                            platforms: selectedPlatforms,
                                            rating: selectedRating,
                                        }
                                        await refillSwipeGamesWithFilters(filters);
                                    }
                                }, 350)
                            }}
                            OverlayLabelRight={OverlayRight}
                            OverlayLabelLeft={OverlayLeft}
                        />
                    </GestureHandlerRootView>
                    <View style={styleHome.buttonsContainer}>
                        <NopeButton onPress={() =>  ref.current?.swipeLeft()}></NopeButton>
                        <View style={{gap:hp("2%"), alignItems: "center"}}>
                            <RewindButton onPress={() =>  ref.current?.swipeBack()}></RewindButton>
                            <FilterButton onApply={refillSwipeGamesWithFilters} selectedGenre={selectedGenres} selectedPlatform={selectedPlatforms} selectedRating={selectedRating}  />
                        </View>
                        <LikeButton onPress={() => ref.current?.swipeRight()}></LikeButton>
                    </View>
                </>
            )}
        </View>
    );
}