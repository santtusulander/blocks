import React from 'react'
import { List, fromJS } from 'immutable'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Form, FormGroup, FormControl, InputGroup } from 'react-bootstrap'
import SelectWrapper from '../../select-wrapper'

import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import TableSorter from '../../table-sorter'
import Paginator from '../../paginator/paginator'

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
      // sortBy: 'created_at',
      // sortDir: -1,
      // sortFunc: '',
      activePage: 1,
      filteredStatus: filterOptions[0].value,
      sortedStats: List(),
      searchText: '',
      selectedColumn: null
    }

    this.changeSort = this.changeSort.bind(this)
    this.filterData = this.filterData.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onColumnSelect = this.onColumnSelect.bind(this)
    this.updateFilter = this.updateFilter.bind(this)
  }

  componentWillMount() {
    const { historyData } = this.props
    this.setData(historyData)
  }

  componentWillReceiveProps(nextProps) {
    const { historyData } = nextProps
    this.setData(historyData)
  }

  filterData(data) {
    const activeFilter = this.state.filteredStatus
    return data.filter(item => {
      return activeFilter === 'all' ? true : item.get('status') === activeFilter
    })
  }

  changeSort(column, direction, sortFunc) {
    const sortOrder = direction > 0 ? 'desc' : 'asc';
    this.props.columnSorter(column, sortOrder);

    this.setState({
      sortBy: column,
      sortDir: direction,
      sortFunc: sortFunc
    }, () => this.setData(this.props.historyData))
  }

  updateFilter() {
    const { searchText: filter_value, selectedColumn: filter_by } = this.state;

    if (filter_value && filter_value.length >2 && filter_by) {
      this.props.filterBySearch(filter_by, filter_value);
    }
  }

  onSearchChange({ target: { value } }) {
    this.setState({searchText: value});
  }

  onColumnSelect(col) {
    this.setState({selectedColumn: col});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!fromJS(prevState).equals(fromJS(this.state))) {
      this.updateFilter();
    }
  }

  setData(historyData){
    const sortedStats = getSortData(this.filterData(historyData), this.state.sortBy, this.state.sortDir, this.state.sortFunc)
    return this.setState({ sortedStats })
  }

  render() {

    const { intl, pagination } = this.props
    const { sortedStats } = this.state

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const colSelectOptions = [
      {
        value: 'created_by',
        label: <FormattedMessage id="portal.content.property.purgeStatus.table.initiatedBy.label"/>
      },
      {
        value: 'note',
        label: <FormattedMessage id="portal.content.property.purgeStatus.table.description.label"/>
      }
    ];

    const formatTime = timestamp => formatUnixTimestamp(timestamp, 'MM/DD/YYYY HH:mm')
    // TODO: temporarily hidden, see UDNP-1926 for more context
    // const getLabelForStatus = status => {
    //   const option = filterOptions.find(option => option.value === status)
    //   return option.label
    // }
    const handlePageSelect = (page) => {
      this.setState({activePage: page});
      pagination.onSelect(page);
    }

    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={intl.formatMessage({ id: 'portal.content.property.purgeStatus.section.title' })} >
          <div className="form-inline">
            <FormGroup>
              <InputGroup>
                <FormControl
                  className="search-input"
                  placeholder="Search"
                  onChange={this.onSearchChange}
                  value={this.state.searchText}
                />
                <SelectWrapper
                  className="input-group-btn"
                  options={colSelectOptions}
                  onChange={this.onColumnSelect}
                  value={this.state.selectedColumn}
                />
              </InputGroup>
            </FormGroup>
          </div>
        </SectionHeader>
        <SectionContainer>
          <div style={{opacity: this.props.fetching? 0.6 : 1}}>
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
            <Paginator
              {...pagination}
              activePage={this.state.activePage}
              onSelect={handlePageSelect}
            />
          </div>
        </SectionContainer>
      </div>
    )
  }
}

{/*<p><FormattedMessage id="portal.content.property.purgeStatus.notFound.label"/></p>*/}

PurgeHistoryReport.displayName = 'PurgeHistoryReport'
PurgeHistoryReport.propTypes = {
  columnSorter: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  filterBySearch: React.PropTypes.func,
  historyData: React.PropTypes.instanceOf(List),
  intl: React.PropTypes.object,
  pagination: React.PropTypes.object
}

PurgeHistoryReport.defaultProps = {}

export default injectIntl(PurgeHistoryReport)
