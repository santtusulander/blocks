import React, { PropTypes } from 'react'

const ComparisonBars = ({currentValue, referenceValue}) => {
  let referenceWidth, currentWidth = 1
  if (currentValue > referenceValue) {
    currentWidth = 100
    referenceWidth = 100 * referenceValue / currentValue
  } else {
    referenceWidth = 100
    currentWidth = 100 * currentValue / referenceValue
  }
  if (currentWidth === 0) currentWidth = 1

  return (
    <div className='comparison-bars-container'>
      <div className='comparison-bar current' style={{width: `${currentWidth}%`}} />
      <div className='comparison-bar reference' style={{width: `${referenceWidth}%`}} />
    </div>
  )
}

ComparisonBars.displayName = 'ComparisonBars'
ComparisonBars.propTypes = {
  currentValue: PropTypes.number,
  referenceValue: PropTypes.number
}

export default ComparisonBars
