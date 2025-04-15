'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { addUserType, User } from "@/types/UserTypes";
import { supabase } from "@/utils/supabase/client";

interface UsersContextType {
    users: User[];
    loadingUsers: boolean;
    addUser: (user: addUserType) => void;
    loadingCreate: boolean;
    loadingGetUser: boolean;
    user?: User;
    getUserById: (id: string) => void;
    updateUserStatus: (newStatus: boolean) => Promise<boolean>;
    getActiveBuyers: () => void;
    activeBuyers: ActiveBuyer[];
}

type ActiveBuyer = {
    full_name: string
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const [loadingGetUser, setLoadingGetUser] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [activeBuyers, setActiveBuyers] = useState<ActiveBuyer[]>([]);

    async function getUsers() {
        try {
            setLoadingUsers(true);
            const { data, error } = await supabase
                .from("profiles")
                .select(`*, roles(name)`);

            if (error) throw error;

            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    }

    useEffect(() => {
        getUsers(); // Cargar usuarios inicialmente

        const channel = supabase
            .channel('realtime-users')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log("Cambio detectado en la tabla profiles:", payload);
                    getUsers(); // Volver a cargar los usuarios cuando haya un cambio
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function addUser(user: addUserType) {

        try {
            setLoadingCreate(true);
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const result = await res.json();
            if (!res.ok) throw result.error;

            console.log("Usuario creado correctamente", result.data);
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setLoadingCreate(false);
        }
    }

    const getUserById = async (id: string) => {

        try {

            setLoadingGetUser(true);

            const { data: user, error } = await supabase
                .from('profiles')
                .select(`*, roles(name)`)
                .eq('id', id)
                .single();

            if (error) throw error;

            setUser(user);

        } catch (err) {
            console.log(err)
        } finally {
            setLoadingGetUser(false);
        }
    }

    const updateUserStatus = async (newStatus: boolean): Promise<boolean> => {
        if (!user?.id) {
            console.log("No se pudo actualizar el estado: user no definido");
            return false;
        }

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ status: newStatus })
                .eq("id", user.id);

            if (error) {
                console.error("Error actualizando el estado del usuario:", error);
                return false;
            }
            await getUsers();
            return true;
        } catch (err) {
            console.error("Error inesperado al actualizar el estado del usuario:", err);
            return false;
        }
    };


    const getActiveBuyers = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("status", true)
                .in("role", [4, 5, 6]);

            if (error) {
                console.error("Error actualizando el estado del usuario:", error);
                return;
            }
            console.log(data)
            setActiveBuyers(data);
        } catch (err) {
            console.error("Error inesperado al actualizar el estado del usuario:", err);
        }
    }

    return (
        <UsersContext.Provider value={{ users, loadingUsers, addUser, loadingCreate, getUserById, loadingGetUser, user, updateUserStatus, getActiveBuyers, activeBuyers }}>
            {children}
        </UsersContext.Provider>
    );
}

export const useCUsers = (): UsersContextType => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("Debe revisar el provider.");
    }
    return context;
};