// GameProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { FavGame } from "../../domain/entities/FavGame";
import {LoginUserInterface, RegisterUserInterface, UserInterface} from "../../domain/entities/User";

interface UserInfoAuthProps {
    registerValues: RegisterUserInterface | undefined;
    loginValues: LoginUserInterface | undefined;
    onChangeLogin: (key: string, value: string) => void;
    onChangeRegister: (key: string, value: string) => void;
}

const UserInfoAuthContext = createContext<UserInfoAuthProps | undefined>(undefined);

export const UserInfoAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [registerValues, setRegisterValues] = useState<RegisterUserInterface>()
    const [loginValues, setLoginValues] = useState<LoginUserInterface>()

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


    return (
        <UserInfoAuthContext.Provider value={{registerValues, loginValues, onChangeLogin, onChangeRegister }}>
            {children}
        </UserInfoAuthContext.Provider>
    );
};

export const useUserInfoAuthContext = () => {
    const context = useContext(UserInfoAuthContext);
    if (!context) throw new Error("useuseUserInfoAuthContextGameContext must be used inside UserInfoAuthProvider");
    return context;
};
