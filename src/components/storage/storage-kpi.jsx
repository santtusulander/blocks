import React from 'react'

const StorageKPI = () => {
  return (
    <div>
      <div className='storage-kpi-item'>
        <h5>Current</h5>
      </div>
      <div className='storage-kpi-item'>
        <h5>Peak</h5>
      </div>
      <div className='storage-kpi-item'>
        <h5>Gain</h5>
      </div>
      <div className='storage-kpi-item'>
        <h5>Location</h5>
      </div>
    </div>
  )
}

StorageKPI.displayName = "StorageKPI"
export default StorageKPI
