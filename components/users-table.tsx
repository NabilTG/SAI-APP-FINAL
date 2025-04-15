'use client'
import { useCUsers } from '@/context/UsersContext';
import { addToast, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { RiProhibitedLine } from "react-icons/ri";

function UsersTable() {

    const { users, getUserById, loadingGetUser, user, updateUserStatus } = useCUsers();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedStatus, setSelectedStatus] = useState(true);
    //funcion para cargar el usuario seleccionado y abrir el modal

    const handleLoad = async (id: string) => {
        await getUserById(id)
        onOpen();
    }

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const status = e.target.value;

        console.log(status)

        if (status === String(1)) {
            setSelectedStatus(true)
        } else {
            setSelectedStatus(false)
        }
    }

    const handleUpdateStatus = async (current: boolean | undefined, onClose: () => void) => {
        if (current === selectedStatus) {
            return;
        }
    
        const success = await updateUserStatus(selectedStatus);
        if (success) {
            addToast({
                title: "Usuario Modificado Correctamente",
                color: "success",
                timeout: 5000,
            });
            onClose(); // Cerrar el modal después de actualizar
        } else {
            addToast({
                title: "Oops!",
                description: "Ocurrió un error al editar el usuario.",
                color: "danger",
                timeout: 5000,
            });
        }
    };

    return (
        <>
            <Table
                classNames={{
                    th: "bg-red-500 text-white text-lg"
                }}
                selectionMode='single'
            >
                <TableHeader>
                    <TableColumn>Cedula</TableColumn>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn>Rol</TableColumn>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id} className='text-black' onClick={() => handleLoad(user.id)}>
                            <TableCell>{user.national_id}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.status ?
                                <div className='flex gap-2 items-center'>Activo <FaCheck color='green' /> </div>
                                :
                                <div className='flex gap-2 items-center'>Inactivo <RiProhibitedLine color='red' /> </div>
                            }
                            </TableCell>
                            <TableCell>{user.roles.name}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-danger">Opciones de Usuario</ModalHeader>
                            <ModalBody>
                                <Skeleton isLoaded={!loadingGetUser}>
                                    <p className='p-2 text-gray-700'>{user?.full_name}</p>
                                    <Select label="Estado" defaultSelectedKeys={user?.status === true ? "1" : "2"} onChange={onStatusChange}>
                                        <SelectItem key={"1"} className='text-black'>Activo</SelectItem>
                                        <SelectItem key={"2"} className='text-black'>Inactivo</SelectItem>
                                    </Select>
                                </Skeleton>

                            </ModalBody>
                            <ModalFooter>
                                <Skeleton isLoaded={!loadingGetUser}>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button color="primary" onPress={() => handleUpdateStatus(user?.status, onClose)}>
                                        Aceptar
                                    </Button>
                                </Skeleton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default UsersTable