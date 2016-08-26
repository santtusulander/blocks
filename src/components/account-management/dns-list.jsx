import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'

import UDNButton from '../button'
import ActionLinks from './action-links'

import recordTypes from '../../constants/dns-record-types'

const DNSList = ({ onDeleteEntry, onEditEntry, onAddEntry, records, searchValue, searchFunc }) => {
  let tables = []
  let recordsByType = {}
  records.forEach(record => {
    if(!recordsByType[record.type]) {
      recordsByType[record.type] = []
    }
    recordsByType[record.type].push(record)
  })
  const getContent = type =>
    recordsByType[type].map((record, i) =>
      <tr key={i}>
        <td>{record.name}</td>
        <td>{record.value}</td>
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
              <table className="table table-striped cell-text-left">
                <thead >
                  <tr>
                    <th width="30%">HOSTNAME</th>
                    <th width="30%">ADDRESS</th>
                    <th width="30%">TTL</th>
                    <th width="8%"></th>
                  </tr>
                </thead>
                <tbody>
                 {getContent(type)}
                </tbody>
              </table>
            </div>
          )
        }
      })}
      {tables}
    </div>
  )
}

export default DNSList

DNSList.propTypes = {
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  records: PropTypes.array,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}
