import {removeUserUseCase} from "../../../domain/usesCases/userLocal/RemoveUser";
import {ApiDelivery} from "../../../data/sources/remote/api/ApiDelivery";
import {GetUserInterface, LoggedUserInterface, UpdateUserDTO, UserInterface} from "../../../domain/entities/User";
import Toast from "react-native-toast-message";
import {UserNavigation} from "../../navigation/UserNavigation";
import {UserLocalRepository} from "../../../data/repositories/UserLocalRepository";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {useState} from "react";
import {PasswordsDTO} from "../../../domain/entities/UpdatePasswordDTO";
import {getUserDBUseCase} from "../../../domain/usesCases/account/GetUser";
import {updateUserUseCase} from "../../../domain/usesCases/account/UpdateUser";
import {updatePasswordUseCase} from "../../../domain/usesCases/account/UpdatePassword";
import {clearTokens} from "../../../data/sources/local/secure/TokenStorage";

export const accountViewModel =()=> {

    const [userDB, setUserDB] = useState<GetUserInterface>()
    const [showLoading, setShowLoading] = useState(true);
    let [errorMessage, setErrorMessage] = useState("");

    const [updatePasswordDTO, setUpdatePasswordDTO] = useState<PasswordsDTO>({
        oldPassword: "",
        newPassword: "",
    });

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
        setShowLoading(true)
        const response = await updateUserUseCase(slug, data)
        setShowLoading(false)
    }

    const validateUpdatePasswordForm = () => {
        if (updatePasswordDTO.oldPassword === "" || updatePasswordDTO.confirmPassword === "" || updatePasswordDTO.newPassword === "") {
            setErrorMessage("Empty fields are not allowed")
            return false
        } if (updatePasswordDTO.newPassword.length < 8) {
            setErrorMessage("Password must have at least 8 characters")
            return false
        } if (updatePasswordDTO.confirmPassword !== updatePasswordDTO.newPassword) {
            setErrorMessage("Passwords do not match");
            return false
        }
        return true;
    }

    return {
        deleteSession,
        getUserDB,
        userDB,
        showLoading,
        updateUserDetails,
        updatePasswordDTO,
        setUpdatePasswordDTO,
        errorMessage,
        setShowLoading,
        setErrorMessage,
    };
}

export default { AccountViewModel: accountViewModel };