// GameProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { FavGame } from "../../domain/entities/FavGame";
import {LoginUserInterface, RegisterUserInterface, UserInterface} from "../../domain/entities/User";

interface UserInfoAuthProps {
    registerValues: RegisterUserInterface | undefined;
    loginValues: LoginUserInterface | undefined;
    setLoginValues: React.Dispatch<React.SetStateAction<LoginUserInterface | undefined>>;
    setRegisterValues: React.Dispatch<React.SetStateAction<RegisterUserInterface | undefined>>;
    onChangeLogin: (key: string, value: string) => void;
    onChangeRegister: (key: string, value: string) => void;
    onChangeDynamic: (login: boolean, key: string, value: string) => void;
    login: boolean;
    setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInfoAuthContext = createContext<UserInfoAuthProps | undefined>(undefined);

export const UserInfoAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [registerValues, setRegisterValues] = useState<RegisterUserInterface>()
    const [loginValues, setLoginValues] = useState<LoginUserInterface>()
    const [login, setLogin] = useState<boolean>(false);

    const onChangeRegister=(property:string, value:any)=>{
        setRegisterValues({
            ...registerValues, [property]:value
        })
    }

    const onChangeLogin=(property:string, value:any)=>{
        setLoginValues({
            ...loginValues, [property]:value
        })
    }

    const onChangeDynamic = (login: boolean, key: string, value: string) => {
        if (login) {
            onChangeLogin(key, value);
        } else {
            onChangeRegister(key, value);
        }
    }


    return (
        <UserInfoAuthContext.Provider value={{registerValues, loginValues, setLoginValues, setRegisterValues, onChangeLogin, onChangeRegister, onChangeDynamic, login, setLogin}}>
            {children}
        </UserInfoAuthContext.Provider>
    );
};

export const useUserInfoAuthContext = () => {
    const context = useContext(UserInfoAuthContext);
    if (!context) throw new Error("useuseUserInfoAuthContextGameContext must be used inside UserInfoAuthProvider");
    return context;
};
