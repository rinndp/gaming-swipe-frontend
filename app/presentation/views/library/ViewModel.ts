import {ApiDelivery} from "../../../data/sources/remote/api/ApiDelivery";
import React, {useCallback, useState} from 'react';
import {FavGame} from "../../../domain/entities/FavGame";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import Toast from "react-native-toast-message";
import {Game} from "../../../domain/entities/Game";
import {loadFavGamesUseCase} from "../../../domain/usesCases/favGames/LoadFavGames";
import {deleteFavGameUseCase} from "../../../domain/usesCases/favGames/DeleteFavGame";
import {loadPlayedGamesUseCase} from "../../../domain/usesCases/favGames/LoadPlayedGames";
import {addPlayedGameUseCase} from "../../../domain/usesCases/favGames/AddPlayedGame";
import {deletePlayedGameUseCase} from "../../../domain/usesCases/favGames/DeletePlayedGame";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {DeviceEventEmitter} from "react-native";
import {useUserGamesContext} from "../../provider/GameProvider";


export const favScreenViewModel = () => {
    const { playedListGames, setPlayedListGames, favListGames, setFavListGames } = useUserGamesContext();
    let [showLoading, setShowLoading] = useState(true);

    const loadFavGames = async (slug: string) => {
        const response = await loadFavGamesUseCase(slug);
        setFavListGames(response);
        setShowLoading(false);
    }

    const loadPlayedGames = async (slug: string) => {
        const response = await loadPlayedGamesUseCase(slug);
        setPlayedListGames(response);
        setShowLoading(false);
    }

    const addPlayedGame = async (slug: string, favgame: FavGame) => {
        await addPlayedGameUseCase(slug, favgame);
        await loadFavGames(slug);
        await loadPlayedGames(slug);
    }

    const deleteGameFromFav = async (id_api: number, slug: string) => {
        await deleteFavGameUseCase(slug, id_api)
        await loadFavGames(slug)
    }

    const deletePlayedGame = async (id_api: number, slug: string) => {
        await deletePlayedGameUseCase(slug, id_api)
        await loadPlayedGames(slug)
    }

    return{
        favListGames,
        playedListGames,
        setFavListGames,
        setPlayedListGames,
        loadFavGames,
        loadPlayedGames,
        addPlayedGame,
        showLoading,
        deleteGameFromFav,
        deletePlayedGame,
        setShowLoading,
    }
}

export default {favScreenViewModel}