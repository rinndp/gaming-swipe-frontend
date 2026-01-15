import { TouchableOpacity } from "react-native"
import { UseUserLocalStorage } from "../hooks/UseUserLocalStorage";
import { useUserGamesContext } from "../provider/GameProvider";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { styleGameDetails } from "../views/details/StyleGameDetails";
import { addGameToFavoriteUseCase } from "../../domain/usesCases/home/AddGameToFavorite";
import { FavGame } from "../../domain/entities/FavGame";
import { deleteFavGameUseCase } from "../../domain/usesCases/favGames/DeleteFavGame";

interface Props {
    game: FavGame | undefined;
    loadFavGames: () => Promise<void>;
}

export const HandleLikeButton = ({game, loadFavGames}: Props) => {
    const {user} = UseUserLocalStorage()
    const {favListGames, playedListGames} = useUserGamesContext()
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isPlayed, setIsPlayed] = useState<boolean>(false)

   
    useEffect(() => {
        setIsLiked(false)
        setIsPlayed(false)
        if (checkIfGameFromApiIsLiked(game?.id_api || 0))
            setIsLiked(true)
        else if (checkIfGameFromApiIsPlayed(game?.id_api || 0)) 
            setIsPlayed(true)
    }, [favListGames, playedListGames, game?.id_api || 0]);

    const checkIfGameFromApiIsLiked = (gameId: number) => {
        return favListGames.some(game => game.id_api === gameId);
    }

    const checkIfGameFromApiIsPlayed = (gameId: number) => {
        return playedListGames.some(game => game.id_api === gameId);
    }

    const handleLike = async () => {
        if (isLiked) {
            setIsLiked(false)
            await deleteFavGameUseCase(user?.slug || "", game?.id_api || 0);
            await loadFavGames();
        } else {
            setIsLiked(true)
            if (game) {
            await addGameToFavoriteUseCase(user?.slug || "", game);
            await loadFavGames();
            }
        }
    }

    return (
        <TouchableOpacity onPress={isPlayed ? undefined : handleLike}>
            {isPlayed ? (
                <Image
                    contentFit={"contain"}
                    cachePolicy={"memory-disk"}
                    priority={"high"}
                    style={styleGameDetails.fav} 
                    source={require("../../../assets/check-icon.png")}
                />
            ) : (
                <Image
                    contentFit={"contain"}
                    cachePolicy={"memory-disk"}
                    priority={"high"}
                    style={styleGameDetails.fav}
                    source={isLiked 
                        ? require("../../../assets/filled-heart.png")
                        : require("../../../assets/heart.png")
                    }
                />
            )}
        </TouchableOpacity>
    )
}