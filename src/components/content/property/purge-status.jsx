import React from 'react'
import { List } from 'immutable'
import { injectIntl, FormattedMessage } from 'react-intl'

import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import TableSorter from '../../table-sorter'
import SelectWrapper from '../../../components/select-wrapper'

import { formatUnixTimestamp, getSortData } from '../../../util/helpers'

const filterOptions = [
  { value: 'all', label: <FormattedMessage id="portal.content.property.purgeStatus.all.label"/> },
  { value: 'created', label: <FormattedMessage id="portal.content.property.purgeStatus.created.label"/> },
  { value: 'completed', label: <FormattedMessage id="portal.content.property.purgeStatus.completed.label"/> }
]

class PurgeHistoryReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sortBy: 'status',
      sortDir: -1,
      sortFunc: '',
      filteredStatus: filterOptions[0].value,
      sortedStats: List()
    }

    this.changeSort = this.changeSort.bind(this)
    this.filterData = this.filterData.bind(this)
  }

  componentWillMount() {
    const { historyData } = this.props
    this.setData(historyData)
  }

  componentWillReceiveProps(nextProps) {
    const { historyData } = nextProps
    this.setData(historyData)
  }

  setData(historyData){
    const sortedStats = getSortData(this.filterData(historyData), this.state.sortBy, this.state.sortDir, this.state.sortFunc)
    return this.setState({ sortedStats })
  }

  filterData(data) {
    const activeFilter = this.state.filteredStatus
    return data.filter(item => {
      return activeFilter === 'all' ? true : item.get('status') === activeFilter
    })
  }

  changeSort(column, direction, sortFunc) {
    this.setState({
      sortBy: column,
      sortDir: direction,
      sortFunc: sortFunc
    }, () => this.setData(this.props.historyData))
  }

  render() {

    const { intl } = this.props
    const { sortedStats } = this.state

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={intl.formatMessage({ id: 'portal.content.property.purgeStatus.section.title' })}>
          <div className="form-group inline">
            <SelectWrapper
              id='filtered-status'
              value={this.state.filteredStatus}
              onChange={value => {
                this.setState({ filteredStatus: value }, () => this.setData(this.props.historyData))
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
