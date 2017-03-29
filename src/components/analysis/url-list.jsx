import React from 'react'
import Immutable from 'immutable'
import numeral from 'numeral'
import { FormattedMessage } from 'react-intl'
import { formatBytes } from '../../util/helpers'
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
    const sortedURLs = this.sortedData(
      urls,
      this.state.sortBy,
      this.state.sortDir
    )
    const filteredURLs = sortedURLs.filter((url) => {
      return url.get('url').toLowerCase().includes(searchState.toLowerCase())
    })

    const finalURLs = filteredURLs.slice(0, 15)

    let minHeight = 0
    const listContainer = this.refs.listContainer
    if (listContainer) {
      const footerRect = document.querySelector('footer.footer').getBoundingClientRect()
      const containerRect = listContainer.getBoundingClientRect()
      minHeight = window.innerHeight - containerRect.top - (footerRect.bottom - containerRect.bottom)
    }

    return (
      <div ref="listContainer" style={{ minHeight }}>
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="status_code" width="1%">
                <FormattedMessage id="portal.analytics.urlList.status.text"/>
              </TableSorter>
              <TableSorter {...sorterProps} column="url" textAlign="left" width="59%">
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
            {finalURLs.map((url, i) => {
              const bytesOfMax = (url.get('bytes') / maxBytes) * 100
              const reqsOfMax = (url.get('requests') / maxReqs) * 100
              return (
                <tr key={i}>
                  <td>{url.get('status_code')}</td>
                  <td className="text-left">{url.get('url')}</td>
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
