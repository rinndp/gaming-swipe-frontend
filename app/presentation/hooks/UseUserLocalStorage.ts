import {useEffect, useState} from "react";
import {LoggedUserInterface} from "../../domain/entities/User";
import {getUserUseCase} from "../../domain/usesCases/user-local/GetUser";

export const UseUserLocalStorage = () => {
    const [user, setUser] = useState<LoggedUserInterface>()

    useEffect(() => {
        getUserSession()
    }, [])

    const getUserSession = async() => {
        const user = await getUserUseCase()
        setUser(user)
    }

    return {
        user,
        getUserSession,
        setUser
    }
}