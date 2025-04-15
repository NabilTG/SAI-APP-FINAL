'use client'

import { ApbRequest, CreateRequest, Request } from "@/types/RequestsTypes";
import { supabase } from "@/utils/supabase/client";
import { addToast } from "@heroui/react";
import { createContext, useContext, useState, useCallback } from "react";

interface RequestContextType {
    getPendingRequests: (roleId: number) => Promise<void>;
    getNewestRequests: (roleId: number) => Promise<void>;
    approveReq: (newStatus: number, reqId: number, userId: string) => void;
    getAprobadorRequests: () => void;
    getFinancieroRequests: () => void;
    finanReqs: ApbRequest[];
    requests: ApbRequest[];
    newRequests: Request[];
    abpjReqs: ApbRequest[];
    loadingRequests: boolean;
    createRequest: (request: CreateRequest) => Promise<void>;
    loadingCreate: boolean;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: React.ReactNode }) {
    const [requests, setRequests] = useState<ApbRequest[]>([]);
    const [newRequests, setNewRequests] = useState<Request[]>([]);
    const [abpjReqs, setApbjReqs] = useState<ApbRequest[]>([]);
    const [finanReqs, setFinanReqs] = useState<ApbRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

    const getPendingRequests = useCallback(async (roleId: number) => {
        try {
            setLoadingRequests(true);
            if (roleId === 2 || roleId === 3) {
                const { data, error } = await supabase
                    .from('purchase_request')
                    .select('*, user:profiles!purchase_request_user_id_fkey(full_name)')
                    .order('created_at', { ascending: false })

                if (error) throw error;
                if (error) console.log(error)
                setRequests(data || []);
            } else {

            }
        } catch (err) {
            console.error("Error obteniendo las solicitudes:", err);
        } finally {
            setLoadingRequests(false);
        }
    }, []);

    const getNewestRequests = useCallback(async (roleId: number) => {
        try {
            setLoadingRequests(true);
            if (roleId === 2 || roleId === 3) {
                const { data, error } = await supabase
                    .from('purchase_request')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(2);

                if (error) throw error;
                if (error) console.log(error)
                setNewRequests(data || []);
            }
            // Agregar validaciones para los roles 4, 5 y 6 si es necesario

        } catch (err) {
            console.error("Error obteniendo las solicitudes:", err);
        } finally {
            setLoadingRequests(false);
        }
    }, []);



    const createRequest = async (request: CreateRequest) => {

        try {
            setLoadingCreate(true);
            const { error } = await supabase
                .from('purchase_request')
                .insert(request);

            if (error) throw error;

            addToast({
                title: "Éxito",
                description: "Solicitud Creada Correctamente!",
                color: "success",
                timeout: 5000,
            });
        } catch (err: unknown) {
            console.error("Error creando la solicitud:", err);
        } finally {
            setLoadingCreate(false);
        }
    }

    const getAprobadorRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('purchase_request')
                .select('*, user:profiles!purchase_request_user_id_fkey(full_name)')
                .eq('status_id', 1)

            if (error) throw error;
            if (error) console.log(error)
            setApbjReqs(data || []);
        } catch (error) {
            console.log("Error obteniendo los requests del Aprobador Jefe", error);
        }
    }

    const getFinancieroRequests = async () => {

        try {
            const { data, error } = await supabase
                .from('purchase_request')
                .select('*, user:profiles!purchase_request_user_id_fkey(full_name)')
                .eq('status_id', 2)

            if (error) throw error;
            if (error) console.log(error)

            setFinanReqs(data || []);

        } catch (error) {
            console.log("Error obteniendo los requests del Aprobador Jefe", error);
        }
    }

    const approveReq = async (newStatus: number, reqId: number, userId: string) => {

        const queryJef = {
            'pre_approved_by': userId,
            'status_id': newStatus
        }

        const queryFin = {
            'approved_by': userId,
            'status_id': newStatus
        }

        const queryDenied = {
            'status_id': newStatus,
            'rejected_by': userId
        }

        try {
            const { error } = await supabase
                .from('purchase_request')
                .update(
                    newStatus === 2 ? queryJef : newStatus === 3 ? queryFin : queryDenied
                )
                .eq('id', reqId)
            if (error) throw error;
            if (error) console.log(error)

            if (newStatus === 2 || newStatus === 3) {
                addToast({
                    title: "Éxito",
                    description: `Solicitud ${newStatus === 2 ? "Pre Aprobada" : "Aprobada"} Correctamente!`,
                    color: "success",
                    timeout: 5000,
                });
            } else {
                addToast({
                    title: "Completado.",
                    description: "Solicitud Denegada Correctamente!",
                    color: "danger",
                    timeout: 5000,
                });
            }
            getAprobadorRequests();
            getFinancieroRequests();


        } catch (error) {
            console.log("Error Aprobando la Solicitud: \n", error)
        }
    }

    return (
        <RequestContext.Provider value={{ getPendingRequests, requests, loadingRequests, createRequest, loadingCreate, getNewestRequests, newRequests, getAprobadorRequests, abpjReqs, approveReq, getFinancieroRequests, finanReqs }}>
            {children}
        </RequestContext.Provider>
    );
}

export const useRequests = (): RequestContextType => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error("useRequests debe estar dentro de un RequestProvider");
    }
    return context;
};  