'use client'
import CreateForm from '@/components/create-user-form'
import UsersTable from '@/components/users-table'
import { Tab, Tabs } from '@heroui/react'
import React from 'react'

function Admin() {
  return (
    <div className="flex-row justify-center mt-5">
      <Tabs aria-label="Dynamic tabs" className='mx-auto' fullWidth>
        <Tab title="Crear Usuario" key={1}>
          <CreateForm />
        </Tab>
        <Tab title="Usuarios" key={2}>
          <UsersTable />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Admin