'use client'
import { useRequests } from '@/context/RequestContext'
import { User } from '@/types/UserTypes';
import { supabase } from '@/utils/supabase/client';
import { formatDateEs } from '@/utils/utils';
import { Accordion, AccordionItem, addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, toast, useDisclosure } from '@heroui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaRegHandPaper } from 'react-icons/fa';

function SolicitudesAprobador() {

    const { getAprobadorRequests, abpjReqs, approveReq } = useRequests();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedReqId, setSelectedReqId] = useState<number | null>(null);
    const [creatorId, setCreatorId] = useState<string | null>(null);
    const [action, setAction] = useState<number | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReqs = async () => {
            await getAprobadorRequests();
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                console.error('Error fetching user or no user found');
                return;
            }

            setUserId(user.id)
        }
        fetchReqs()
    }, [approveReq])

    const handleApprove = async (reqId: number) => {
        try {
            const { data: user, error } = await supabase
                .from('profiles')
                .select(`*, roles(name)`)
                .eq('id', creatorId)
                .single();

            if (error || !user) throw error;

            await approveReq(action === 1 ? 2 : 4, reqId, userId!);

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreDestino: user.full_name,
                    idSolicitud: reqId,
                    estadoSolicitud: action === 1 ? "Pre Aprobada" : "Denegada",
                    correos: user.email
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
                description: `El correo fue enviado a ${user.email}`,
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
    };

    return (
        <div>
            <Accordion variant='splitted'>
                {abpjReqs &&
                    abpjReqs.map((req) => (
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
                                                setCreatorId(req.user_id)
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
                                                setCreatorId(req.user_id)
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

export default SolicitudesAprobador