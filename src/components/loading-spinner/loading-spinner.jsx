import React from 'react'

import './loading-spinner.scss'

function LoadingSpinner() {
  return (
    <div className='loading-spinner'>
      <div className='spinner-content' />
    </div>
  )
}

LoadingSpinner.displayName = "LoadingSpinner"

export default LoadingSpinner
