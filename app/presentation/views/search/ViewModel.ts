import  {useState} from "react";
import {Company, Game} from "../../../domain/entities/Game";
import {IgdbApiDelivery} from "../../../data/sources/remote/igdbAPI/IgdbApiDelivery";
import {searchMostAnticipatedGamesUseCase} from "../../../domain/usesCases/search/SearchMostAnticipatedGames";
import {searchGamesByUserInputUseCase} from "../../../domain/usesCases/search/SearchGamesByUserInput";
import {searchCompanyByUserInputUseCase} from "../../../domain/usesCases/search/SearchCompanyByUserInput";
import {CompanyDetailsInterface} from "../../../domain/entities/Company";
import {searchUsersUseCase} from "../../../domain/usesCases/search/SearchUsers";
import {GetSearchUserInterface, UpdateUserDTO} from "../../../domain/entities/User";
import {useAnticipatedGames} from "../../hooks/UseAnticipatedGames";
import {useGameDetails} from "../../hooks/UseGameDetails";
import {useTimeout} from "react-native-toast-message/lib/src/hooks";


export const searchViewModel = () => {
    const [searchText, setSearchText] = useState("");
    const [searchUserText, setSearchUserText] = useState("");
    const [gamesDisplayed, setGamesDisplayed] = useState<Game[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<GetSearchUserInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [appliedFilters, setAppliedFilters] = useState<{ category: string | null; platform: string | null }>({
        category: null,
        platform: null,
    });
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [debounceTimeoutUser, setDebounceTimeoutUser] = useState<NodeJS.Timeout | null>(null);
    const {data, isLoading, error} = useAnticipatedGames();


    const searchUsers = async (userParameters: UpdateUserDTO) => {
        if (userParameters.username !== "") {
            const response = await searchUsersUseCase(userParameters);
            setSearchedUsers(response)
        } else {
            setSearchedUsers([]);
        }
        setLoading(false);
    }

    const searchMostAnticipatedGames = async () => {
        if (data !== undefined) {
            setGamesDisplayed(data);
        }
        setLoading(false)
    };

    const searchGamesByUserInput = async (input: string, page: number = 1, showLoading: boolean) => {
        setLoading(showLoading);
        const response = await searchGamesByUserInputUseCase(input, page);
        
        if (page === 1) {
            setGamesDisplayed(response);
        } else if (page > 1) {
            setGamesDisplayed((prevGames) => {
                const existingIds = new Set(prevGames.map(g => g.id));
                const newGames = response.filter(g => !existingIds.has(g.id));
                return [...prevGames, ...newGames];
            });
        }
        setLoading(false);
    };

    const onSearchTextChange = (text: string) => {
        setSearchText(text);
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(async () => {
            if (text === "") {
                await searchMostAnticipatedGames();
            } else {
                setPage(1);
                await searchGamesByUserInput(text, 1, true);
            }
        }, 400);

        setDebounceTimeout(timeout);
    };

    const onSearchUserTextChange = async (text: string) => {
        setSearchUserText(text);

        if (debounceTimeoutUser) clearTimeout(debounceTimeoutUser)
        const timeout = setTimeout(async () => {
            await searchUsers({username: text});
        }, 400)
        setDebounceTimeoutUser(timeout);
    }

    const loadMoreGames = async () => {
        if (!loading && gamesDisplayed.length >= 13 && searchText !== "") {
            const nextPage = page + 1;
            setPage(nextPage);
            await searchGamesByUserInput(searchText, nextPage, false);
        }
    };

    return {
        gamesDisplayed,
        setGamesDisplayed,
        loading,
        loadMoreGames,
        onSearchTextChange,
        searchText,
        searchGamesByUserInput,
        searchMostAnticipatedGames,
        setSearchText,
        filtersApplied,
        appliedFilters,
        setAppliedFilters,
        setFiltersApplied,
        setSelectedCategory,
        setSelectedPlatform,
        searchedUsers,
        searchUsers,
        searchUserText,
        selectedPlatform,
        selectedCategory,
        setLoading,
        onSearchUserTextChange
    }
}
export default {searchViewModel}