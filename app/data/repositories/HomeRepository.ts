import {HomeRepositoryInterface} from "../../domain/repositories/HomeRepositoryInterface";
import {ApiDeliveryResponse} from "../sources/remote/models/ApiDeliveryResponse";
import {ApiDelivery} from "../sources/remote/api/ApiDelivery";
import {IgdbApiDelivery} from "../sources/remote/igdbAPI/IgdbApiDelivery";
import {AxiosError} from "axios";
import {Game, GameSimilarGames, Platform} from "../../domain/entities/Game";
import {FavGame} from "../../domain/entities/FavGame";
import Toast from "react-native-toast-message";

const SWIPE_GAMES_CALLED_FROM_API = 15
const NOT_NULL_FIELDS_GAME_QUERY = "& genres != null & platforms != null & cover != null;"


export class HomeRepository implements HomeRepositoryInterface {
    async getSimilarGamesFromGame(gameId: number): Promise<GameSimilarGames[]> {
        try {
            const response = await IgdbApiDelivery.post(
                "/games",
                "fields similar_games.name, similar_games.cover.url, similar_games.platforms.abbreviation, " +
                "similar_games.platforms.name, similar_games.genres.name, similar_games.rating, "+
                'similar_games.release_dates.y, similar_games.release_dates.date; where id = '+gameId+';',
            )
            return Promise.resolve(response.data);
        } catch (error) {
            let e = error as AxiosError;
            console.log(e.message);
            return Promise.reject(e);
        }
    }

    refillGamesFromSwiper= async (): Promise<Game[]> => {
        try {
            const query = `where rating >= 70 ${NOT_NULL_FIELDS_GAME_QUERY}`
            const maxGames = await IgdbApiDelivery.post(
                "/games/count", query)

            const maxOffset = Math.max(0, maxGames.data?.count - 10);
            const randomOffset = Math.round(((Math.random()*maxOffset)*100)/100).toFixed(0)
            const response = await IgdbApiDelivery.post(
                "/games",
                "fields name, " +
                "cover.url, " +
                "genres.name, " +
                "platforms.abbreviation, " +
                "platforms.name, summary, " +
                "rating, release_dates.y, release_dates.date;" +
                " limit "+SWIPE_GAMES_CALLED_FROM_API+";"+query+" offset "+randomOffset+";")

            return Promise.resolve(response.data)
        } catch (error) {
            let e = error as AxiosError;
            console.log(e.message);
            return Promise.reject(e);
        }
    }

    refillGamesFromSwiperWithFilters = async (platforms: Platform[], genres: Platform[], rating: number): Promise<Game[]> => {
        try {
            const decimalRating = rating-1;
            let query = ""
            let response
            if (genres.length === 0 && platforms.length === 0 && rating === 70) {
                response = await this.refillGamesFromSwiper()
                return Promise.resolve(response)
            }
            const genresToString = genres.map(item => item.id).join(', ');
            const platformsToString = platforms.map(item => item.id).join(', ');
                if (genres.length > 0 && platforms.length > 0) {
                    query = 'where genres = ['+genresToString+'] & platforms = ['+platformsToString+`] & rating >= ${decimalRating} ${NOT_NULL_FIELDS_GAME_QUERY};`
                } else if (genres.length > 0 && platforms.length === 0) {
                    query = 'where genres = ['+genresToString+`] & rating >= ${decimalRating} ${NOT_NULL_FIELDS_GAME_QUERY};`
                } else if (genres.length === 0 && platforms.length > 0) {
                    query = 'where platforms = ['+platformsToString+`] & rating >= ${decimalRating} ${NOT_NULL_FIELDS_GAME_QUERY};`
                } else if (rating > 0)
                    query = `where rating >= ${decimalRating} ${NOT_NULL_FIELDS_GAME_QUERY};`;
                const maxGames = await IgdbApiDelivery.post(
                    "/games/count", query)

                const maxOffset = Math.max(0, maxGames.data?.count - 10);
                const randomOffset = Math.round(((Math.random()*maxOffset)*100)/100).toFixed(0)
                response = await IgdbApiDelivery.post(
                    "/games",
                    "fields name, " +
                    "cover.url, " +
                    "genres.name, " +
                    "platforms.abbreviation, platforms.name, release_dates.date, summary," +
                    "rating, release_dates.y; limit 15; offset "+randomOffset+";"+
                    query)
            return Promise.resolve(response.data)
        } catch (error) {
            let e = error as AxiosError;
            console.log(e.message);
            return Promise.reject(e);
        }
    }

    async addGameToFavorite(slug: string, videogame: FavGame): Promise<ApiDeliveryResponse> {
        try {
            const response = await ApiDelivery.post(`/favgames/add/${slug}`, videogame);
            return Promise.resolve(response.data)
        }  catch (error)  {
            const e = (error as AxiosError<{error:string}>);
            console.log(e.response);
            Toast.show({
                type: 'error',
                text1: e.response?.data.error,
            })
            return Promise.reject(e.response?.data.error);
        }
    }

}