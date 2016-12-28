import React from 'react'

import './loading-spinner.scss'

function LoadingSpinnerSmall() {
  return (
    <div className='loading-spinner-sm'>
      <div className='spinner-content-sm' />
    </div>
  )
}

LoadingSpinnerSmall.displayName = "LoadingSpinnerSmall"

export default LoadingSpinnerSmall
