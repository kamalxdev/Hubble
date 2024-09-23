

export interface iUser{
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    username: string;
    password: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}