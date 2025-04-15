'use client'
import { useRequests } from '@/context/RequestContext'
import { ApbRequest } from '@/types/RequestsTypes';
import { supabase } from '@/utils/supabase/client';
import { formatDateEs } from '@/utils/utils';
import {
    Accordion, AccordionItem, addToast, Button, Modal, ModalBody,
    ModalContent, ModalFooter, ModalHeader, useDisclosure
} from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaRegHandPaper } from 'react-icons/fa';

function SolicitudesFinanciero() {

    const { getFinancieroRequests, finanReqs, approveReq } = useRequests();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [filteredReqs, setFilteredReqs] = useState<ApbRequest[]>([]);
    const [selectedReqId, setSelectedReqId] = useState<number | null>(null);
    const [action, setAction] = useState<number | null>(null);
    const [creatorId, setCreatorId] = useState<string | null>(null);
    const [apbJefeId, setApbJefeId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    // Llama a la función para cargar las solicitudes
    useEffect(() => {
        getFinancieroRequests();
    }, []);

    // Filtra las solicitudes cuando se actualicen
    useEffect(() => {
        if (finanReqs.length > 0) {
            filterFinanReqs(finanReqs);
        }
    }, [finanReqs]);


    const filterFinanReqs = async (reqs: ApbRequest[]) => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error('Error fetching user or no user found');
            return;
        }

        const roleId = user.user_metadata?.roleId;
        setUserId(user.id)
        let min = 0;
        let max = Infinity;

        switch (roleId) {
            case 4:
                max = 100000;
                break;
            case 5:
                min = 100001;
                max = 1000000;
                break;
            case 6:
                min = 1000001;
                max = 1000000000;
                break;
            default:
                setFilteredReqs(reqs); // Si el rol no aplica, mostramos todas
                return;
        }

        const filtered = reqs.filter(req => req.total_request >= min && req.total_request <= max);
        setFilteredReqs(filtered);
        console.log(filtered)
    };

    const handleApprove = async (reqId: number) => {

        try {
            const { data: creator, error } = await supabase
                .from('profiles')
                .select(`*, roles(name)`)
                .eq('id', creatorId)
                .single();

            if (error || !creator) throw error;

            const { data: jefe, error: jerror } = await supabase
                .from('profiles')
                .select(`*, roles(name)`)
                .eq('id', apbJefeId)
                .single();

            if (jerror || !jefe) throw error;


            await approveReq(action === 1 ? 3 : 4, reqId, userId!);

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreDestino: creator.full_name,
                    idSolicitud: reqId,
                    estadoSolicitud: action === 1 ? "Aprobada" : "Denegada",
                    correos: [creator.email, jefe.email]
                })
            });

            if (!response.ok) {
                addToast({
                    title: `Error al enviar el correo!`,
                    description: `Comunicate con el administrador.`,
                    color: `danger`,
                    icon: "x",
                    timeout: 5000,
                });
                return;
            }

            addToast({
                title: `Notificación enviada correctamente!`,
                description: `El correo fue enviado a ${creator.email} y ${jefe.email}`,
                color: `success`,
                icon: "check",
                timeout: 5000,
            });

            setCreatorId(null);
            setAction(null);
            setSelectedReqId(null);
        } catch (err) {
            console.error(err);
            addToast({
                title: `Error inesperado`,
                description: `No se pudo completar la acción.`,
                color: `danger`,
                icon: "alert-triangle",
                timeout: 5000,
            });
        }
    }

    return (
        <div>
            {filteredReqs.length === 0 && (
                <div className='w-full h-[700px] flex items-center justify-center text-2xl gap-3'>
                    <h1 className=" text-gray-400">Sin solicitudes pendientes</h1>
                    <SearchIcon color='red' size={30} />
                </div>
            )}
            <Accordion variant='splitted'>
                {filteredReqs.map((req) => (
                    <AccordionItem key={req.id} title={req.product_name} subtitle={`₡ ${req.total_request}`}>
                        <div className="grid grid-cols-12 items-center">
                            <div className="col-span-7 text-lg">
                                <p>Fecha de Solicitud: <span className='text-gray-400 capitalize'>{formatDateEs(req.created_at)}</span></p>
                                <p>Solicitante: <span className='text-red-500'>{req.user.full_name}</span></p>
                                <p>Estado de la solicitud: <span className='text-gray-400'>{req.status_id === 1 && "Pendiente de Aprobación"}</span></p>
                                <p>Artículos Solicitados: <span className='text-red-500'>{req.product_name} (Qty: {req.product_qty})</span></p>
                                <p>Precio Unitario: <span className='text-gray-400'>₡{req.product_price}</span></p>
                                <p>Monto Total: <span className='text-gray-400'>₡{req.total_request}</span></p>
                                <p>Descripción: <span className='text-gray-400'>{req.comment}</span></p>
                            </div>
                            <div className="col-span-5 p-5 mx-auto">
                                <Image src={req.image_url} alt='image' width={300} height={300} />
                                <div className="flex justify-between gap-10 mt-5">
                                    <Button
                                        size='lg'
                                        startContent={<BiSolidCheckCircle size={20} />}
                                        className='bg-gradient-to-r from-green-400 to-green-500 text-white'
                                        onPress={() => {
                                            setSelectedReqId(req.id);
                                            setCreatorId(req.user_id);
                                            setApbJefeId(req.pre_approved_by);
                                            setAction(1);
                                            onOpen();
                                        }}
                                        fullWidth>
                                        Aprobar
                                    </Button>
                                    <Button
                                        size='lg'
                                        variant='light'
                                        color='danger'
                                        startContent={<FaRegHandPaper size={20} />}
                                        onPress={() => {
                                            setSelectedReqId(req.id);
                                            setCreatorId(req.user_id);
                                            setApbJefeId(req.pre_approved_by);
                                            setAction(2);
                                            onOpen();
                                        }}
                                        fullWidth
                                    >
                                        Denegar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Aprobar Solicitud</ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Seguro que desea <span className='text-red-500 font-semibold'>{action === 1 ? "Aprobar" : "Denegar"}</span> la solicitud?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={async () => {
                                        if (selectedReqId !== null) {
                                            await handleApprove(selectedReqId);
                                            onOpenChange();
                                            setSelectedReqId(null);
                                        }
                                    }}>
                                    {action === 1 ? "Aprobar" : "Denegar"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SolicitudesFinanciero;
