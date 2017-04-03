import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FormGroup, FormControl, InputGroup } from 'react-bootstrap'

import SelectWrapper from '../../select-wrapper'
import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import TableSorter from '../../table-sorter'
import Paginator from '../../paginator/paginator'

import { formatUnixTimestamp } from '../../../util/helpers'

const PurgeHistoryReport = (props) => {
  const {
    intl, historyData, fetching,
    activePage, items, onActivePageChange,
    filter_by, filter_value,  onFilterChange,
    sort_order, sort_by, onSortingChange
  } = props;

  const pagination = { activePage, items, onSelect: onActivePageChange };

  const sorterProps = {
    activeColumn: sort_by,
    activeDirection: sort_order,
    activateSort: onSortingChange
  };

  const formatTime = timestamp => formatUnixTimestamp(timestamp, 'MM/DD/YYYY HH:mm');
  const selectOptions = [
    {
      value: 'created_by',
      label: intl.formatMessage({id: "portal.content.property.purgeStatus.table.initiatedBy.label"})
    },
    {
      value: 'note',
      label: intl.formatMessage({id: "portal.content.property.purgeStatus.table.description.label"})
    }
  ];

  const getSectionContent = () => {
    return historyData.size ? grid : filter_value && filter_by ? msgNoResult : msgNoData
  }

  const msgNoData = (
    <div className="text-capitalize text-center">
      <FormattedMessage id="portal.common.no-data.text" />
    </div>
  );

  const msgNoResult = (
    <div className="text-capitalize text-center">
      <FormattedMessage id="portal.common.search.no-results.text" />
    </div>
  );

  const grid = (
    <div style={{opacity: fetching ? 0.6 : 1}}>
      <table className="table table-striped table-analysis">
        <thead>
        <tr>
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
        {historyData.map((data, i) => (
          <tr key={i}>
            <td>{formatTime(data.get('created_at'))}</td>
            <td>{data.get('completed_at') && formatTime(data.get('completed_at'))}</td>
            <td>{data.get('created_by')}</td>
            <td>{data.get('note')}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <Paginator {...pagination} />
    </div>
  );

  return (
    <div>
      <SectionHeader
        sectionHeaderTitle={intl.formatMessage({ id: 'portal.content.property.purgeStatus.section.title' })} >
        <div className="form-inline">
          <FormGroup>
            <InputGroup>
              <FormControl
                style={{marginLeft: 0}}
                className="search-input"
                placeholder="Search"
                onChange={({ target: { value }}) => onFilterChange(filter_by, value)}
                value={filter_value}
              />
              <SelectWrapper
                className="input-group-btn"
                options={selectOptions}
                onChange={(value) => onFilterChange(value, filter_value)}
                value={filter_by}
              />
            </InputGroup>
          </FormGroup>
        </div>
      </SectionHeader>
      <SectionContainer>
        {getSectionContent()}
      </SectionContainer>
    </div>
  )
}


PurgeHistoryReport.displayName = 'PurgeHistoryReport'
PurgeHistoryReport.propTypes = {
  activePage: PropTypes.number,
  fetching: PropTypes.bool,
  filter_by: PropTypes.string,
  filter_value: PropTypes.string,
  historyData: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  items: PropTypes.number,
  onActivePageChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  onSortingChange: PropTypes.func,
  sort_by: PropTypes.string,
  sort_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default injectIntl(PurgeHistoryReport)
