import { ImagesProvider } from '@/context/ImagesContext'
import { RequestProvider } from '@/context/RequestContext'
import { UsersProvider } from '@/context/UsersContext'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import React from 'react'

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <HeroUIProvider>
      <ToastProvider/>
      <ImagesProvider>
        <RequestProvider>
          <UsersProvider>
            {children}
          </UsersProvider>
        </RequestProvider>
      </ImagesProvider>
    </HeroUIProvider>
  )
}

export default Providers