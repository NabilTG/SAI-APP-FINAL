'use client'

import { supabase } from "@/utils/supabase/client";
import { createContext, useContext, useState } from "react";

interface ImagesContextType {
    imageURL: string | null;
    uploadImage: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;    
    loadingImage: boolean;
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

const bucket = 'requestimages';

export function ImagesProvider({ children }: { children: React.ReactNode }) {

    const [imageURL, setImageURL] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState<boolean>(false);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {

        setLoadingImage(true);
        const file = event.target.files?.[0]; // Asegura que hay un archivo seleccionado
    
        if (!file) {
            console.error("No se seleccionó ningún archivo.");
            return;
        }
    
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(`public/${Date.now()+file.name}`, file, {
                    cacheControl: '3600',
                    upsert: false,
                });
    
            if (error) throw error;
            if (error) console.log(error);
    
            
            await getImageURL(data.path);
        } catch (err: unknown) {
            console.error("Error subiendo la imagen:", err);
        }finally{
            setLoadingImage(false);
        }
    };

    const getImageURL = async (path: string) => {
        try {
            const { data } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(path)
                setImageURL(data?.publicUrl);
        }catch(err : unknown){
            console.error("Error obteniendo la URL de la imagen:", err);
        }
    }

    return (
        <ImagesContext.Provider value={{imageURL, uploadImage, loadingImage}}>
            {children}
        </ImagesContext.Provider>
    );
}

export const useImages = (): ImagesContextType => {
    const context = useContext(ImagesContext);
    if (!context) {
        throw new Error("useRequests debe estar dentro de un RequestProvider");
    }
    return context;
};  