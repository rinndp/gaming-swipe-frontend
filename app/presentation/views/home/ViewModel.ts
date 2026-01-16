import {IgdbApiDelivery} from "../../../data/sources/remote/igdbAPI/IgdbApiDelivery";
import {useState} from "react";
import {Game, GameDetailsInterface, Genre, GenreDTO, Platform} from "../../../domain/entities/Game";
import {ApiDelivery} from "../../../data/sources/remote/api/ApiDelivery";
import {FavGame} from "../../../domain/entities/FavGame";
import viewModel from "../fav/ViewModel";
import {refillGamesFromSwiperUseCase} from "../../../domain/usesCases/home/RefillGamesFromSwiper";
import {addGameToFavoriteUseCase} from "../../../domain/usesCases/home/AddGameToFavorite";
import {refillGamesFromSwiperWithFiltersUseCase} from "../../../domain/usesCases/home/RefillGamesFromSwiperWithFilters";
import {NO_IMAGE_URL, transformCoverUrl} from "../../utils/TransformCoverUrls";
import {generateNoGamesFoundCard} from "../../utils/NoGameFoundWithThisFilters";
import {getSimilarGamesFromGameUseCase} from "../../../domain/usesCases/home/GetSimilarGamesFromGame";


export const homeViewModel = () => {

    let [listGames, setListGames] = useState<Game[]>([]);
    let [showLoading, setShowLoading] = useState(true);
    let [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
    let [selectedGenres, setSelectedGenres] = useState<Platform[]>([]);
    let [selectedRating, setSelectedRating] = useState<number>(70);
    let [swipesCounter, setSwipesCounter] = useState(0);
    let [userLikedSimilarGames, setUserLikedSimilarGames] = useState<Game[]>([]);

    const {favListGames} = viewModel.favScreenViewModel();

    const refillSwipeGames = async () => {
        setShowLoading(true);
        const response = await refillGamesFromSwiperUseCase()
    
        setUserLikedSimilarGames((prevSimilarGames) => {            
            if (prevSimilarGames.length > 0) {
                const gamesToAdd = prevSimilarGames.slice(0, 5);
                setListGames([...gamesToAdd, ...response]);
                return prevSimilarGames.slice(5);
            } else {
                setListGames(response);
                return prevSimilarGames;
            }
        });
        setShowLoading(false);
    }

    const getSimilarGamesFromGame = async (gameId: number) => {
        return await getSimilarGamesFromGameUseCase(gameId)
    }

    const refillSwipeGamesWithFilters = async (filters: { genres: Platform[]; platforms: Platform[], rating: number}) => {
        setShowLoading(true);
        setSelectedPlatforms(filters.platforms);
        setSelectedGenres(filters.genres);
        setSelectedRating(filters.rating);
        const response = await refillGamesFromSwiperWithFiltersUseCase(filters.platforms, filters.genres, filters.rating);
        if (response.length === 0) {
            const gamesNotFoundCard = generateNoGamesFoundCard(filters.genres, filters.platforms, filters.rating)
            setListGames([gamesNotFoundCard, gamesNotFoundCard]);
        } else {
            setListGames(response)
        }
        setShowLoading(false);
    }

    const addGameToFav = async (game: FavGame | undefined, slug: string) => {
        if (game !== undefined)
            await addGameToFavoriteUseCase(slug, game);
    }

    const transformGameIntoFavGameInterface =(item: Game | GameDetailsInterface | undefined) => {
        if (item !== undefined) {
            const favGameDTO: FavGame = {
                name: item.name,
                rating_score: item.rating ? Number(item.rating.toFixed(1)) : 0,
                release_date: item.release_dates ? item.release_dates[0].date : undefined,
                summary: item.summary,
                image_url: item.cover ? transformCoverUrl(item.cover.url) : NO_IMAGE_URL,
                platforms: item.platforms ? item.platforms : [],
                genres: item.genres ? item.genres : [],
                id_api: item.id
            }
            console.log(item.release_dates ? item.release_dates[0].y : 0)
            console.log(favGameDTO)
            return favGameDTO;
        }
    }

    return {
        listGames,
        refillSwipeGames,
        setListGames,
        showLoading,
        setShowLoading,
        addGameToFav,
        swipesCounter,
        setSwipesCounter,
        refillSwipeGamesWithFilters,
        selectedGenres,
        selectedPlatforms,
        transformGameIntoFavGameInterface,
        getSimilarGamesFromGame,
        selectedRating,
        setSelectedRating,
        userLikedSimilarGames,
        setUserLikedSimilarGames,
    }
}

export default {homeViewModel}