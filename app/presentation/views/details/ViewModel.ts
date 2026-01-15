import {loadFavGamesUseCase} from "../../../domain/usesCases/favGames/LoadFavGames";
import {useState} from "react";
import {GameDetailsInterface, SimilarGame} from "../../../domain/entities/Game";
import {loadGameDetailsUseCase} from "../../../domain/usesCases/gameDetails/LoadGameDetails";
import {loadCompanyDetailsUseCase} from "../../../domain/usesCases/gameDetails/LoadCompanyDetails";
import {CompanyDetailsInterface} from "../../../domain/entities/Company";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {GetUserInterface} from "../../../domain/entities/User";
import {getUserDBUseCase} from "../../../domain/usesCases/account/GetUser";
import {FavGame} from "../../../domain/entities/FavGame";
import {loadPlayedGamesUseCase} from "../../../domain/usesCases/favGames/LoadPlayedGames";
import {useGameDetails} from "../../hooks/UseGameDetails";

export const userDetailsViewModel = () => {
    const [showLoading, setShowLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<GetUserInterface>()
    const [favGames, setFavGames] = useState<FavGame[]>([])
    const [playedGames, setPlayedGames] = useState<FavGame[]>([])

    const loadUserGames = async (slug: string) => {
        setShowLoading(true)
        const responseFav = await loadFavGamesUseCase(slug);
        const responsePlayed = await loadPlayedGamesUseCase(slug);
        setFavGames(responseFav)
        setPlayedGames(responsePlayed)
        setShowLoading(false)
    }

    return {
        showLoading,
        userDetails,
        favGames,
        playedGames,
        loadUserGames,
        setShowLoading,

    }

}

export const companyDetailsViewModel = () => {
    const [showLoading, setShowLoading] = useState(true);
    const [companyDetails, setCompanyDetails] = useState<CompanyDetailsInterface>();



    const loadCompanyDetails = async (companyId: number) => {
        const response = await loadCompanyDetailsUseCase(companyId);
        setCompanyDetails(response[0]);
        console.log(response[0]);
        setShowLoading(false);
    }

    countries.registerLocale(enLocale);

    return {
        showLoading,
        loadCompanyDetails,
        companyDetails,
    }
}

export default {companyDetailsViewModel}