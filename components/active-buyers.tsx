'use client'
import { useCUsers } from '@/context/UsersContext'
import { Avatar } from '@heroui/react';
import React, { useEffect } from 'react'

function ActiveBuyers() {

  const { getActiveBuyers, activeBuyers } = useCUsers();

  useEffect(() => {
    const fetchBuyers = async () => {
      await getActiveBuyers()
    }

    fetchBuyers();
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-semibold text-foreground py-2'>Aprobadores Financieros Activos</h1>

      <div className="grid grid-cols-12">
        <div className="col-span-8 mt-5 p-5">
          <div className="flex items-center w-full justify-between">
            {activeBuyers && activeBuyers.map((buyer) => (
              <div className='text-center' key={buyer.full_name}>
                <Avatar size='lg' className='mx-auto' />
                <p className='mt-2'>{buyer.full_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveBuyers