import {removeUserUseCase} from "../../../domain/usesCases/user-local/RemoveUser";
import {GetUserInterface, LoggedUserInterface, UpdateUserDTO} from "../../../domain/entities/User";
import {useState} from "react";
import {getUserDBUseCase} from "../../../domain/usesCases/account/GetUser";
import {updateUserUseCase} from "../../../domain/usesCases/account/UpdateUser";
import {clearTokens} from "../../../data/sources/local/secure/TokenStorage";

export const accountViewModel =()=> {

    const [userDB, setUserDB] = useState<GetUserInterface>()
    const [showLoading, setShowLoading] = useState(true);
    let [errorMessage, setErrorMessage] = useState("");

    const deleteSession = async () => {
        await removeUserUseCase()
        await clearTokens()
    }

    const getUserDB = async (slug: string) => {
        const response = await getUserDBUseCase(slug)
        setUserDB(response)
        setShowLoading(false)
    }

    const updateUserDetails = async (slug: string, data: UpdateUserDTO | FormData | undefined) => {
        const response = await updateUserUseCase(slug, data)
    }

    return {
        deleteSession,
        getUserDB,
        userDB,
        showLoading,
        updateUserDetails,
        errorMessage,
        setShowLoading,
        setErrorMessage,
    };
}

export default { AccountViewModel: accountViewModel };