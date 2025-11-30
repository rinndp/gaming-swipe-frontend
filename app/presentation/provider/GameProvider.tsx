import React, { createContext, useContext, useState } from "react";
import { FavGame } from "../../domain/entities/FavGame";

interface GameContextProps {
    favListGames: FavGame[];
    playedListGames: FavGame[];
    setFavListGames: React.Dispatch<React.SetStateAction<FavGame[]>>;
    setPlayedListGames: React.Dispatch<React.SetStateAction<FavGame[]>>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [favListGames, setFavListGames] = useState<FavGame[]>([]);
    const [playedListGames, setPlayedListGames] = useState<FavGame[]>([]);
    return (
        <GameContext.Provider value={{ favListGames, playedListGames, setFavListGames, setPlayedListGames }}>
            {children}
        </GameContext.Provider>
    );
};

export const useUserGamesContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used inside GameProvider");
    return context;
};
