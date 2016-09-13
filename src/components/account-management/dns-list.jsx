import React, { PropTypes, Component } from 'react'
import { Input } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import PageContainer from '../../components/layout/page-container'
import SectionHeader from '../../components/layout/section-header'
import UDNButton from '../button'
import ActionButtons from '../../components/action-buttons'
import TableSorter from '../table-sorter'
import IsAllowed from '../is-allowed'

import recordTypes from '../../constants/dns-record-types'
import { getRecordValueString } from '../../util/dns-records-helpers'
import { CREATE_RECORD } from '../../constants/permissions'

class DNSList extends Component {

  shouldComponentUpdate(nextProps) {
    return !nextProps.modalOpen
  }

  render() {
    const { onDeleteEntry, onEditEntry, onAddEntry, records, searchValue, searchFunc, intl } = this.props
    let tables = []
    let recordsByType = {}
    records.forEach(record => {
      if(!recordsByType[record.type]) {
        recordsByType[record.type] = []
      }
      recordsByType[record.type].push(record)
    })

    const getContent = type => sortingFunc =>
      sortingFunc(recordsByType[type]).map((record, i) =>
        <tr key={i}>
          <td>{record.name}</td>
          <td>{getRecordValueString(record.value)}</td>
          <td>{record.ttl}</td>
          <td className="nowrap-column">
            <ActionButtons
              onEdit={() => onEditEntry(record.id)}
              onDelete={() => onDeleteEntry(record)}/>
          </td>
        </tr>
      )
    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={<span id="domain-stats">{`${records.length} Records`}</span>}>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder="Search records"
            value={searchValue}
            onChange={searchFunc}/>
          <IsAllowed to={CREATE_RECORD}>
            <UDNButton
              id="add-dns-record"
              bsStyle="success"
              onClick={onAddEntry}>
              ADD RECORD
            </UDNButton>
          </IsAllowed>
        </SectionHeader>

        {recordTypes.sort().forEach((type, index) => {
          if (recordsByType.hasOwnProperty(type)) {
            tables.push(
              <div key={index}>
                <SectionHeader sectionSubHeaderTitle={`${type} ` + <FormattedMessage id='portal.account.dnsList.records.header' />} />
                <SortableTable content={getContent(type)}/>
              </div>
            )
          }
        })}
        {tables}
      </PageContainer>
    )
  }
}

class SortableTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortDirection: 1
    }
  }

  render() {
    const { sortDirection } = this.state
    const changeSort = (column, direction) => this.setState({ sortDirection: direction })
    const sort = array =>
      array.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1 * sortDirection
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1 * sortDirection
        }
        return 0
      })
    const sortedContent = this.props.content(sort)
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
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          {sortedContent}
        </tbody>
      </table>
    )
  }
}

SortableTable.propTypes = { content: PropTypes.func }

DNSList.propTypes = {
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  records: PropTypes.array,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}

export default injectIntl(DNSList)
