import React from 'react'
import Immutable from 'immutable'
import numeral from 'numeral'
import {FormattedMessage} from 'react-intl'

import {formatBytes} from '../../util/helpers'
import TableSorter from '../table-sorter'

class AnalysisURLList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'bytes',
      sortDir: -1
    }

    this.changeSort = this.changeSort.bind(this)
    this.sortedData = this.sortedData.bind(this)
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      if(a.get(sortBy) < b.get(sortBy)) {
        return -1 * sortDir
      }
      else if(a.get(sortBy) > b.get(sortBy)) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const {urls, searchState} = this.props
    const maxBytes = Math.max(...urls.toJS().map(url => url.bytes))
    const maxReqs = Math.max(...urls.toJS().map(url => url.requests))
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const filteredURLs = urls.filter((url, i) => {
      if (i >= 15) {
        return false;
      }

      return url.get('url').toLowerCase().includes(searchState.toLowerCase())
    })
    const sortedURLs = this.sortedData(
      filteredURLs,
      this.state.sortBy,
      this.state.sortDir
    )


    return (
      <div>
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="status">
                <FormattedMessage id="portal.analytics.urlList.status.text"/>
              </TableSorter>
              <TableSorter {...sorterProps} column="url">
                <FormattedMessage id="portal.analytics.urlList.url.text"/>
              </TableSorter>
              <TableSorter {...sorterProps} column="bytes" width="20%">
                <FormattedMessage id="portal.analytics.urlList.bytes.text"/>
              </TableSorter>
              <TableSorter {...sorterProps} column="requests" width="20%">
                <FormattedMessage id="portal.analytics.urlList.requests.text"/>
              </TableSorter>
            </tr>
          </thead>
          <tbody>
            {sortedURLs.map((url, i) => {
              const bytesOfMax = (url.get('bytes') / maxBytes) * 100
              const reqsOfMax = (url.get('requests') / maxReqs) * 100
              return (
                <tr key={i}>
                  <td>{url.get('status_code')}</td>
                  <td>{url.get('url')}</td>
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
      </div>
    )
  }
}

AnalysisURLList.displayName = 'AnalysisURLList'
AnalysisURLList.propTypes = {
  searchState: React.PropTypes.string,
  urls: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLList.defaultProps = {
  urls: Immutable.List()
}

export default AnalysisURLList
