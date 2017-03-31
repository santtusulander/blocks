import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import numeral from 'numeral'
import classNames from 'classnames'

class PolicyWeight extends Component {

  render() {
    const { steps, value, ...inputProps } = this.props
    const min = 0, max = 100
    const numbersFormat = '0.[00]'

    const ticks = (tickSteps) => {
      const ticksArr = []
      for (let i = 0; i <= tickSteps; i++) {
        ticksArr.push(
          <span className="tick" key={i}>
            { i % 2 === 0 && <span className="tick-label">{numeral(i * (max - min) / tickSteps).format(numbersFormat)}%</span> }
          </span>
        )
      }
      return ticksArr
    }

    return (
      <div className="policy-weight">
        <div className="policy-weight-label">
          <FormattedMessage id="portal.configuration.gtm.policyWeight.label" />
        </div>
        <div className={classNames("policy-weight-scale", {'ms-browser': !!document.documentMode || !!window.StyleMedia})}>
          <input className="policy-weight-slider"
            {...inputProps}
            type="range"
            min={min}
            max={max}
            value={value}
            step={(max - min) / steps}
            style={{'backgroundSize': `${(value - min) * 100 / (max - min)}% 100%`}}
            onMouseUp={inputProps.onChange} // UDNP-3210/UDNP-3211 | we need this event because IE doesn't handle onChange
          />
          <div className="ruler">
            {ticks(steps)}
          </div>
        </div>
        <div className="policy-weight-percentage">
          <div className="primary">
            <strong>{numeral(value).format(numbersFormat)}</strong>
            <FormattedMessage id="portal.configuration.gtm.policyWeight.percentageByMainProvider.percentage" />
          </div>
          <div className="secondary">
            <FormattedMessage
              id="portal.configuration.gtm.policyWeight.secondaryProvider.percentage"
              values={{ percentage: numeral(100 - value).format(numbersFormat) }} />
          </div>
        </div>
      </div>
    )
  }
}

PolicyWeight.defaultProps = {
  steps: 10
}

PolicyWeight.displayName = 'PolicyWeight'
PolicyWeight.propTypes = {
  disabled: PropTypes.bool,
  steps: PropTypes.number,
  value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
}

export default PolicyWeight
