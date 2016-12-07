import React from 'react'
import { List } from 'immutable'
import { injectIntl, FormattedMessage } from 'react-intl'

import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import TableSorter from '../../table-sorter'
// TODO: temporarily hidden, see UDNP-1926 for more context
// import SelectWrapper from '../../../components/select-wrapper'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import { formatUnixTimestamp, getSortData } from '../../../util/helpers'

const filterOptions = [
  { value: 'all', label: <FormattedMessage id="portal.content.property.purgeStatus.all.label"/> },
  { value: 'created', label: <FormattedMessage id="portal.content.property.purgeStatus.created.label"/> },
  { value: 'running', label: <FormattedMessage id="portal.content.property.purgeStatus.running.label"/> },
  { value: 'completed', label: <FormattedMessage id="portal.content.property.purgeStatus.completed.label"/> }
]

class PurgeHistoryReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // TODO: temporarily hidden, see UDNP-1926 for more context
      // sortBy: 'status',
      sortBy: 'created_at',
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

    if(this.props.fetching){
      return (<LoadingSpinner/>);
    }

    const { intl } = this.props
    const { sortedStats } = this.state

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const formatTime = timestamp => formatUnixTimestamp(timestamp, 'MM/DD/YYYY HH:mm')
    // TODO: temporarily hidden, see UDNP-1926 for more context
    // const getLabelForStatus = status => {
    //   const option = filterOptions.find(option => option.value === status)
    //   return option.label
    // }

    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={intl.formatMessage({ id: 'portal.content.property.purgeStatus.section.title' })} />
          {/* TODO: temporarily hidden, see UDNP-1926 for more context */}
          {/*<div className="form-group inline">
            <SelectWrapper
              id='filtered-status'
              value={this.state.filteredStatus}
              onChange={value => {
                this.setState({ filteredStatus: value }, () => this.setData(this.props.historyData))
              }}
              options={filterOptions}/>
          </div>
        </SectionHeader>*/}
        <SectionContainer>
          {sortedStats.size ?
            <table className="table table-striped table-analysis">
              <thead>
              <tr>
                {/* TODO: temporarily hidden, see UDNP-1926 for more context */}
                {/*<TableSorter {...sorterProps} column="status">
                  <FormattedMessage id="portal.content.property.purgeStatus.table.status.label"/>
                </TableSorter>*/}
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
                    {/* TODO: temporarily hidden, see UDNP-1926 for more context */}
                    {/*<td>{getLabelForStatus(data.get('status'))}</td>*/}
                    <td>{formatTime(data.get('created_at'))}</td>
                    <td>{data.get('completed_at') && formatTime(data.get('completed_at'))}</td>
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
  fetching: React.PropTypes.bool,
  historyData: React.PropTypes.instanceOf(List),
  intl: React.PropTypes.object
}

PurgeHistoryReport.defaultProps = {}

export default injectIntl(PurgeHistoryReport)
