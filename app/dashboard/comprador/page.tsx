import RequestsList from '@/components/requests-list'
import RecentsRequestsList from '@/components/requests-recents'
import React from 'react'

function Comprador() {

  const allUrl = "/dashboard/comprador/solicitudes"

  return (
  <div className='grid grid-cols-12 gap-5'>
    <div className="col-span-9">
      <RequestsList allUrl={allUrl}/>
    </div>
    <div className="col-span-3">
    <RecentsRequestsList/>
    </div>
  </div>
  )
}

export default Comprador