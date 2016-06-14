import React from 'react'

import './loading-spinner.scss'

const circleSvg = (
  <svg id='circleSvg' viewBox="0 0 250 250">
      <linearGradient id="linear-gradient" x1="6828.3" y1="-673.22" x2="7078.32" y2="-673.22" gradientTransform="matrix(1, 0, 0, -1, -6828.34, -548.22)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#89ba17"/>
        <stop offset="0.33" stopColor="#00a9d4"/>
        <stop offset="0.66" stopColor="#2e4275"/>
        <stop offset="1" stopColor="#7b0663"/>
      </linearGradient>

    <path id="circle" d="M125,250A125,125,0,1,1,209,32.47a5.87,5.87,0,0,1-7.53,9l-0.36-.32a113.12,113.12,0,1,0,17.77,20.52,5.87,5.87,0,0,1,9.48-6.92l0.24,0.35A125,125,0,0,1,125,250Z" />
  </svg>
)

const logoSvg = (
  <svg id='logoSvg' viewBox="0 0 250 250">
    <path id="e3" d="M101.9,116.92A8.31,8.31,0,0,1,99,100.8l46.2-17a8.31,8.31,0,1,1,5.9,15.54L151,99.4l-46.2,17A8.29,8.29,0,0,1,101.9,116.92Z"/>
    <path id="e2" d="M104.76,141.29l46.2-17a8.31,8.31,0,0,0-5.73-15.6l-46.2,17a8.31,8.31,0,1,0,5.56,15.66Z" />
    <path id="e1" d="M104.76,166.18l46.2-17a8.31,8.31,0,0,0-5.73-15.6l-46.2,17a8.31,8.31,0,0,0,5.18,15.79l0.55-.2h0Z" />
  </svg>
)

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner'>
      <div className='spinner-content'>
        {circleSvg}
        {logoSvg}
      </div>
    </div>
  )
}

export default LoadingSpinner
