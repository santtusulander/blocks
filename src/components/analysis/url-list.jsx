import React from 'react'
import Immutable from 'immutable'
import numeral from 'numeral'

import {formatBytes} from '../../util/helpers'

const AnalysisURLList = ({labelFormat, urls}) => {
  const maxBytes = Math.max(...urls.toJS().map(url => url.bytes))
  const maxReqs = Math.max(...urls.toJS().map(url => url.requests))
  return (
    <table className="table table-striped table-analysis">
      <thead>
        <tr>
          <th>URL</th>
          <th width="20%">Bytes</th>
          <th width="20%">Requests</th>
        </tr>
      </thead>
      <tbody>
        {urls.map((url, i) => {
          const bytesOfMax = (url.get('bytes') / maxBytes) * 100
          const reqsOfMax = (url.get('requests') / maxReqs) * 100
          return (
            <tr key={i}>
              <td>{labelFormat(url)}</td>
              <td>
                {formatBytes(url.get('bytes'))}
                <div className="table-percentage-line">
                  <div className="line" style={{width: `${bytesOfMax}%`}} />
                </div>
              </td>
              <td>
                {numeral(url.get('requests')).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: `${reqsOfMax}%`}} />
                </div>
              </td>
            </tr>
          )
        }).toJS()}
      </tbody>
    </table>
  )
}

AnalysisURLList.displayName = 'AnalysisURLList'
AnalysisURLList.propTypes = {
  labelFormat: React.PropTypes.func,
  urls: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLList.defaultProps = {
  urls: Immutable.List()
}

module.exports = AnalysisURLList
