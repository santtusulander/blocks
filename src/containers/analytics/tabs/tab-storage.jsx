import React, { Component } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import numeral from 'numeral'

import AnalysisStorage from '../../../components/analysis/storage'

import { formatBytes } from '../../../util/helpers.js'

class AnalyticsTabStorage extends Component {

  formatTotals(value) {
    if(this.props.filters.get('storageType') === 'usage') {
      return formatBytes(value, 1e12)
    } else if(this.props.filters.get('storageType') === 'files') {
      return numeral(value).format('0,0')
    }
  }

  render() {
    const {filters, totals} = this.props

    const storageType = filters.get('storageType')
    const peakStorage = !totals.isEmpty() ?
      totals.getIn([storageType, 'peak']) : 0
    const avgStorage  = !totals.isEmpty() ?
      totals.getIn([storageType, 'average']) : 0
    const lowStorage  = !totals.isEmpty() ?
      totals.getIn([storageType, 'low']) : 0

    return (
      <AnalysisStorage
        avgStorage={this.formatTotals(avgStorage)}
        fetching={false}
        lowStorage={this.formatTotals(lowStorage)}
        peakStorage={this.formatTotals(peakStorage)}
        storageType={this.props.filters.get('storageType')}
      />
    )
  }
}

AnalyticsTabStorage.displayName = "AnalyticsTabStorage"
AnalyticsTabStorage.propTypes = {
  filters: React.PropTypes.instanceOf(Immutable.Map),
  totals: React.PropTypes.instanceOf(Immutable.Map)
}

AnalyticsTabStorage.defaultProps = {
  filters: Immutable.Map(),
  totals: Immutable.Map()
}

const mapStateToProps = () => {
  //TODO: Mock date needs to be removed after integration with redux
  return {
    totals: Immutable.fromJS({
      usage: {
        low: 50e12,
        average: 80.2e12,
        peak: 112.2e12
      },
      files: {
        low: 534,
        average: 899,
        peak: 1100
      }
    })
  }
}

const  mapDispatchToProps = () => {
  //TODO: Needs to be changed when integrating with redux
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabStorage);
