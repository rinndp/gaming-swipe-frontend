import {SearchRepositoryInterface} from "../../domain/repositories/SearchRepositoryInterface";
import {Game} from "../../domain/entities/Game";
import {IgdbApiDelivery} from "../sources/remote/igdbAPI/IgdbApiDelivery";
import axios, {AxiosError} from "axios";
import {GetSearchUserInterface, UpdateUserDTO} from "../../domain/entities/User";
import {ApiDelivery} from "../sources/remote/api/ApiDelivery";


export class SearchRepository implements SearchRepositoryInterface {
    async searchMostAnticipatedGames(): Promise<Game[]> {
        try {
            const response = await IgdbApiDelivery.post(
                "/games",
                `fields name, hypes, rating, 
                platforms.abbreviation, platforms.name, genres.name, cover.url, 
                release_dates.y, release_dates.date, summary; 
                limit 15; 
                sort hypes desc; 
                where first_release_date > ${Math.floor(Date.now() / 1000)} & hypes != null;`)
            return Promise.resolve(response.data)
        } catch (error) {
            let e = (error as AxiosError);
            console.log("Error: ", e.message);
            return Promise.reject(e.message);
        }
    }

    async searchGamesByUserInput(input: string, page: number): Promise<Game[]> {
        try {
            const offset = page > 1 ? `offset ${page * 15};` : "";
            const response = await IgdbApiDelivery.post(
                "/games",
                `fields name, 
                rating, 
                platforms.abbreviation, platforms.name,
                genres.name, cover.url,
                summary, release_dates.date, 
                release_dates.y; limit 15; search "${input}"; ${offset}`
            )
            return Promise.resolve(response.data)
        } catch (error) {
            let e = (error as AxiosError);
            console.log("Error: ", e.message);
            return Promise.reject(e.message);
        }
    }

    async searchUsers(userParameters: UpdateUserDTO): Promise<GetSearchUserInterface[]> {
        try {
            const response = await ApiDelivery.post("/users/search/", userParameters);
            return Promise.resolve(response.data)
        } catch (error) {
            let e = (error as AxiosError);
            console.log("Error: ", e.response?.data);
            return Promise.reject(e.response?.data);
        }
    }

}