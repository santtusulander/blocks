import React, { PropTypes } from 'react'

const ComparisonBars = ({currentValue, referenceValue}) => {
  let referenceWidth = 1, currentWidth = 1
  if (!(currentValue === 0 && referenceValue === 0)) {
    if (currentValue > referenceValue) {
      currentWidth = 100
      referenceWidth = 100 * referenceValue / currentValue
    } else {
      referenceWidth = 100
      currentWidth = 100 * currentValue / referenceValue
    }
  }
  currentWidth = Math.max(currentWidth, 1)
  referenceWidth = Math.max(referenceWidth, 1)

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
