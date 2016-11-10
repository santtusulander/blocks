import React from 'react'
import { List } from 'immutable'
import { injectIntl, FormattedMessage } from 'react-intl'
// import { Pagination } from 'react-bootstrap'

import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import TableSorter from '../../table-sorter'
import SelectWrapper from '../../../components/select-wrapper'

import { formatUnixTimestamp } from '../../../util/helpers'

const filterOptions = [
  { value: 'all', label: <FormattedMessage id="portal.content.property.purgeStatus.all.label"/> },
  { value: 'created', label: <FormattedMessage id="portal.content.property.purgeStatus.created.label"/> },
  { value: 'completed', label: <FormattedMessage id="portal.content.property.purgeStatus.completed.label"/> }
]
// Comment this out until the API supports pagination
// const PAGINATION = {
//   items: 10,
//   maxButtons: 5
// }

class PurgeHistoryReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activePage: 1,
      sortBy: 'status',
      sortDir: -1,
      sortFunc: '',
      filteredStatus: filterOptions[0].value
    }

    this.changeSort = this.changeSort.bind(this)
    this.filterData = this.filterData.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
  }

  changeSort(column, direction, sortFunc) {
    this.setState({
      sortBy: column,
      sortDir: direction,
      sortFunc: sortFunc
    })
  }

  filterData(data) {
    const activeFilter = this.state.filteredStatus
    return data.filter(item => {
      return activeFilter === 'all' ? true : item.get('status') === activeFilter
    })
  }

  sortedData(data, sortBy, sortDir) {
    let sortFunc = ''
    if (this.state.sortFunc === 'specific' && sortBy.indexOf(',') > -1) {
      sortFunc = data.sort((a, b) => {
        sortBy = sortBy.toString().split(',')

        const lhs = a.get(sortBy[0])
        const rhs = b.get(sortBy[0])

        // the following conditionals handle cases where a & b contain null data
        if (!lhs && rhs) {
          return -1 * sortDir
        }
        if (lhs && !rhs) {
          return 1 * sortDir
        }
        if (lhs && rhs) {
          if (lhs.get(sortBy[1]) < rhs.get(sortBy[1])) {
            return -1 * sortDir
          } else if (lhs.get(sortBy[1]) > rhs.get(sortBy[1])) {
            return 1 * sortDir
          }
        }

        return 0
      })
    } else {
      sortFunc = data.sort((a, b) => {
        if (a.get(sortBy) < b.get(sortBy)) {
          return -1 * sortDir
        }
        else if (a.get(sortBy) > b.get(sortBy)) {
          return 1 * sortDir
        }
        return 0
      })
    }
    return sortFunc
  }

  handlePaginate(e, paginationEvent) {
    this.setState({
      activePage: paginationEvent.eventKey
    })
  }

  render() {

    const {
      historyData,
      intl
    } = this.props

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const filteredData = this.filterData(historyData)
    const sortedStats = this.sortedData(filteredData, this.state.sortBy, this.state.sortDir)

    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={intl.formatMessage({ id: 'portal.content.property.purgeStatus.section.title' })}>
          <div className="form-group inline">
            <SelectWrapper
              id='filtered-status'
              value={this.state.filteredStatus}
              onChange={value => {
                this.setState({ filteredStatus: value })
              }}
              options={filterOptions}/>
          </div>
        </SectionHeader>
        <SectionContainer>
          {sortedStats.size ?
            <table className="table table-striped table-analysis">
              <thead>
              <tr>
                <TableSorter {...sorterProps} column="status">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.status.label"/>
                </TableSorter>
                <TableSorter {...sorterProps} column="created_at">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.startTime.label"/>
                </TableSorter>
                <TableSorter {...sorterProps} column="completed_at">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.endTime.label"/>
                </TableSorter>
                <TableSorter {...sorterProps} column="created_by">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.initiatedBy.label"/>
                </TableSorter>
                <TableSorter {...sorterProps} column="note">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.description.label"/>
                </TableSorter>
              </tr>
              </thead>
              <tbody>
              {sortedStats.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{data.get('status')}</td>
                    <td>{formatUnixTimestamp(data.get('created_at'))}</td>
                    <td>{data.get('completed_at') && formatUnixTimestamp(data.get('completed_at'))}</td>
                    <td>{data.get('created_by')}</td>
                    <td>{data.get('note')}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            :
            <p><FormattedMessage id="portal.content.property.purgeStatus.notFound.label"/></p>
          }
        </SectionContainer>

        {/* Comment this out until the API supports pagination */}
        {/*        <Pagination className="pull-right"
         items={PAGINATION.items}
         maxButtons={PAGINATION.maxButtons}
         prev={true}
         next={true}
         first={true}
         last={true}
         ellipsis={true}
         activePage={this.state.activePage}
         onSelect={this.handlePaginate}
         />*/}
      </div>
    )
  }
}

PurgeHistoryReport.displayName = 'PurgeHistoryReport'
PurgeHistoryReport.propTypes = {
  historyData: React.PropTypes.instanceOf(List),
  intl: React.PropTypes.object
}

PurgeHistoryReport.defaultProps = {}

export default injectIntl(PurgeHistoryReport)
