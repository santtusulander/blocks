import React, { PropTypes, Component } from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import PageContainer from '../shared/layout/page-container'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'
import { DNSRecordTable } from './dns-record-table'
import UDNButton from '../button'
import ActionButtons from '../shared/action-buttons'
import IsAllowed from '../shared/permission-wrappers/is-allowed'

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
    const tables = []
    const recordsByType = {}

    /**
     * Build recordsByType: { MX: [ ... ], AAAA: [ ... ], ... }. If recordsByType does not contain
     * key for current record type, create key-value pair of [record.type]: []. Push current record
     * to array under the current record type key in recordsByType.
     */
    records.forEach(record => {
      if (!recordsByType[record.type]) {
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
              sectionSubHeaderTitle={`${type} ${intl.formatMessage({id: 'portal.account.dnsList.records.header'})}`}
              subHeaderId={'table-label-' + index} />
            <DNSRecordTable shouldHavePrio={recordFields.prio.includes(type)} content={getContent(type)}/>
          </SectionContainer>
        )
      }
    })

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={<span id="record-amount-label">{visibleRecordCount}{hiddenRecordCount}</span>}>

          <FormGroup className="search-input-group">
            <FormControl
              type="text"
              className="search-input"
              placeholder={intl.formatMessage({id: 'portal.account.dnsList.searchRecords.placeholder'})}
              value={searchValue}
              onChange={searchFunc}/>
          </FormGroup>

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

DNSList.displayName = "DNSList"
DNSList.propTypes = {
  hiddenRecordCount: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  intl: PropTypes.object,
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  records: PropTypes.array,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string,
  visibleRecordCount: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ])
}

export default injectIntl(DNSList)
