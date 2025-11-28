
export interface GetUserInterface {
    username: string
    email: string
    image: string
}

export interface RegisterUserInterface {
    email?: string
    username?: string
    password?: string
    confirmPassword?: string
}

export interface UserInterface {
    username: string
    email: string
    password?: string
    google_id?: string
}


export interface GetSearchUserInterface {
    username: string
    image: string
    slug: string
}


export type UpdateUserDTO = Partial<Pick<GetUserInterface, "username">>

export interface LoginUserInterface {
    email?: string;
    password?: string;
    google_id?: string;
}

export interface LoggedUserInterface {
    slug: string;
    access_token?: string;
    refresh_token?: string
}