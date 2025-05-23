'use client'
import { useRequests } from '@/context/RequestContext'
import { formatDateEs } from '@/utils/utils';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import React, { useEffect } from 'react'

function History() {

    const { requests, getPendingRequests } = useRequests();

    useEffect(() => {
        const fetchReqs = async () => {
            await getPendingRequests(3)
        }

        fetchReqs()
    }, [])

    return (
        <Table
            color='danger'
            classNames={{
                th: "bg-red-500 text-white text-lg"
            }}
        >
            <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Proposito</TableColumn>
                <TableColumn>Fecha</TableColumn>
                <TableColumn>Monto</TableColumn>
                <TableColumn>Solicitante</TableColumn>
                <TableColumn>Aprobador Jefe</TableColumn>
                <TableColumn>Resultado</TableColumn>
            </TableHeader>
            <TableBody>
                {requests && requests.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell>{req.id}</TableCell>
                        <TableCell>{req.product_name}</TableCell>
                        <TableCell>{formatDateEs(req.created_at)}</TableCell>
                        <TableCell>{req.total_request}</TableCell>
                        <TableCell>{req.user.full_name}</TableCell>
                        <TableCell>Aprobador Jefe</TableCell>
                        <TableCell>{req.status_id === 2 ? "Aprobado Jefe" : req.status_id === 3 ? "Aprobado Financiero" : req.status_id === 4 ? "Denegado" : "Pendiente"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default History