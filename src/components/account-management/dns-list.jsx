import React, { PropTypes, Component } from 'react'
import { Input } from 'react-bootstrap'

import UDNButton from '../button'
import ActionLinks from './action-links'
import TableSorter from '../table-sorter'

import recordTypes from '../../constants/dns-record-types'

const DNSList = ({ domain, onDeleteEntry, onEditEntry, onAddEntry, records, searchValue, searchFunc }) => {
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
        <td>
          <Input
            type="checkbox"
            label={record.name.replace(new RegExp(domain, 'i'), '')}/>
        </td>
        <td><TruncatedTitle content={record.value} tooltipPlacement="bottom" className="account-management-title"/></td>
        <td>{record.ttl}</td>
        <td>
        <ActionLinks
        onEdit={() => onEditEntry(record.id)}
        onDelete={() => onDeleteEntry(record.id)}/>
        </td>
      </tr>
    )
  return (
    <div>
      <h3 className="account-management-header">
        <span id="domain-stats">
          {`${records.length} Records`}
        </span>
        <div className='dns-filter-wrapper'>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder="Search records"
            value={searchValue}
            onChange={searchFunc}/>
          <UDNButton
            id="add-dns-record"
            bsStyle="success"
            onClick={onAddEntry}>
            ADD RECORD
          </UDNButton>
        </div>
      </h3>
      <hr/>
      {recordTypes.sort().forEach((type, index) => {
        if (recordsByType.hasOwnProperty(type)) {
          tables.push(
            <div key={index} className='table-container'>
              <h4>{type} Records</h4>
              <SortableTable content={getContent(type)}/>
            </div>
          )
        }
      })}
      {tables}
    </div>
  )
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
    const sort = array => array.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1 * sortDirection
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1 * sortDirection
      }
      return 0
    })
    const sortedItems = this.props.content(sort)
    const sorterProps = {
      activateSort: changeSort,
      activeDirection: sortDirection,
      activeColumn: 'name'
    }
    return (
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <TableSorter {...sorterProps} column="name" width="30%">HOSTNAME</TableSorter>
            <th width="30%">ADDRESS</th>
            <th width="30%">TTL</th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          {sortedItems}
        </tbody>
      </table>
    )
  }
}

SortableTable.propTypes = { content: PropTypes.func }

export default DNSList

DNSList.propTypes = {
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  records: PropTypes.array,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}
