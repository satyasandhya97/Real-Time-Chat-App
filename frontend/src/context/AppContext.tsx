"use client"

import { error } from "console";
import App from "next/app";
import { Children, createContext, ReactNode, useContext, useState } from "react";

export const user_serice = "http://localhost:5000";
export const chat_serice = "http://localhost:5002";

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Chat {
    _id: string;
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}
interface AppContextType {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)


interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    return (
        <AppContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading }}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppData = () : AppContextType => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useappdata must be used within AppProvider");
    }
    
    return context;
}