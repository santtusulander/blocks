import React, { PropTypes, Component } from 'react'
import { Input } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import PageContainer from '../../components/layout/page-container'
import SectionHeader from '../../components/layout/section-header'
import SectionContainer from '../../components/layout/section-container'
import UDNButton from '../button'
import ActionButtons from '../../components/action-buttons'
import TableSorter from '../table-sorter'
import IsAllowed from '../is-allowed'

import recordTypes, { recordFields } from '../../constants/dns-record-types'
import { getRecordValueString } from '../../util/dns-records-helpers'
import { CREATE_RECORD } from '../../constants/permissions'

class DNSList extends Component {

  shouldComponentUpdate(nextProps) {
    return !nextProps.modalOpen
  }

  render() {
    const {
      onDeleteEntry,
      onEditEntry,
      onAddEntry,
      records,
      searchValue,
      searchFunc,
      intl,
      hiddenRecordCount,
      visibleRecordCount } = this.props
    let tables = []
    let recordsByType = {}

    /**
     * Build recordsByType: { MX: [ ... ], AAAA: [ ... ], ... }. If recordsByType does not contain
     * key for current record type, create key-value pair of [record.type]: []. Push current record
     * to array under the current record type key in recordsByType.
     */
    records.forEach(record => {
      if(!recordsByType[record.type]) {
        recordsByType[record.type] = []
      }
      recordsByType[record.type].push(record)
    })

    /**
     * Create rows of records by a given record type, sorted by a given sorting function.
     */
    const getContent = type => sort =>
      sort(recordsByType[type]).map((record, i) =>
        <tr key={i}>
          <td>{record.name}</td>
          <td>{getRecordValueString(record.value)}</td>
          <td>{record.ttl}</td>
          {recordFields.prio.includes(record.type) && <td>{record.value.prio}</td>}
          <td className="nowrap-column">
            <ActionButtons
              onEdit={() => onEditEntry(record.id)}
              onDelete={() => onDeleteEntry(record)}/>
          </td>
        </tr>
      )

    /**
     * For every record type in sorted recordTypes-constant, if recordsByType has current record
     * type as key, push a new sortable table to tables-array. Call getContent to populate table.
     */
    recordTypes.sort().forEach((type, index) => {
      if (recordsByType.hasOwnProperty(type)) {
        tables.push(
          <SectionContainer key={index}>
            <SectionHeader
              sectionSubHeaderTitle={`${type} ` + intl.formatMessage({id: 'portal.account.dnsList.records.header'})}
              subHeaderId={'table-label-' + index} />
            <SortableTable shouldHavePrio={recordFields.prio.includes(type)} content={getContent(type)}/>
          </SectionContainer>
        )
      }
    })

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={<span id="record-amount-label">{visibleRecordCount}{hiddenRecordCount}</span>}>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder={intl.formatMessage({id: 'portal.account.dnsList.searchRecords.placeholder'})}
            value={searchValue}
            onChange={searchFunc}/>
          <IsAllowed to={CREATE_RECORD}>
            <UDNButton
              id="add-dns-record"
              bsStyle="success"
              onClick={onAddEntry}>
              <FormattedMessage id='portal.account.dnsList.addRecord.button' />
            </UDNButton>
          </IsAllowed>
        </SectionHeader>
        {tables}
      </PageContainer>
    )
  }
}

export class SortableTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortDirection: 1
    }
  }

  render() {
    const { state: { sortDirection }, props: { shouldHavePrio, content } } = this
    /**
     * Sorting function
     */
    const sort = array =>
      array.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1 * sortDirection
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1 * sortDirection
        }
        return 0
      })
    const changeSort = (column, direction) => this.setState({ sortDirection: direction })
    const sorterProps = {
      activateSort: changeSort,
      activeDirection: sortDirection,
      activeColumn: 'name'
    }
    return (
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <TableSorter {...sorterProps} column="name" width="30%"><FormattedMessage id='portal.account.dnsList.hostname.header' /></TableSorter>
            <th width="30%"><FormattedMessage id='portal.account.dnsList.address.header' /></th>
            <th width="30%"><FormattedMessage id='portal.account.dnsList.ttl.header' /></th>
            {shouldHavePrio && <th width="30%"><FormattedMessage id='portal.account.dnsList.prio.header' /></th>}
            <th width="1%"></th>
          </tr>
        </thead>
        <tbody>
          {content(sort)}
        </tbody>
      </table>
    )
  }
}

SortableTable.propTypes = { content: PropTypes.func, shouldHavePrio: PropTypes.bool }

DNSList.propTypes = {
  hiddenRecordCount: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  intl: PropTypes.object,
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  records: PropTypes.array,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string,
  visibleRecordCount: PropTypes.object
}

export default injectIntl(DNSList)
