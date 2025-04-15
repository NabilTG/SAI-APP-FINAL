import ActiveBuyers from '@/components/active-buyers'
import RequestsList from '@/components/requests-list'
import RecentsRequestsList from '@/components/requests-recents'
import React from 'react'

function AprobadorJefe() {

  const allUrl = "/dashboard/aprobadorjefe/solicitudes"

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9">
          <RequestsList allUrl={allUrl}/>
        </div>
        <div className="col-span-3">
          <RecentsRequestsList/>
        </div>
      </div>
      <ActiveBuyers/>
    </div>
  )
}

export default AprobadorJefe