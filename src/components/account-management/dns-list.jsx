import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'

import UDNButton from '../button'
import ActionLinks from './action-links'
import IconAdd from '../icons/icon-add'

import recordTypes from '../../constants/dns-record-types'


const records = [
  {
    class: "IN",
    name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
    ttl: 3600,
    type: "AAAA",
    value: "85.184.251.171"
  },
  {
    class: "IN",
    name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
    ttl: 3600,
    type: "AAAA",
    value: "85.184.251.171"
  },
  {
    class: "IN",
    name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
    ttl: 3600,
    type: "MX",
    value: "85.184.251.171"
  },
  {
    class: "IN",
    name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
    ttl: 3600,
    type: "A",
    value: "85.184.251.171"
  }
]

const DNSList = props => {
  const {
    //records,
    onDeleteEntry,
    onEditEntry,
    onAddEntry
  } = props
  let recordsByType = {}
  records.forEach(record => {
    if(!recordsByType[record.type]) {
      recordsByType[record.type] = []
    }
    recordsByType[record.type].push(record)
  })
  let tables = []
  const getContent = type =>
    recordsByType[type].map((record, i) =>
      <tr key={i}>
        <td>{record.name}</td>
        <td>{record.type}</td>
        <td>{record.value}</td>
        <td>{record.ttl}</td>
        <td>
        <ActionLinks
        onEdit={() => onEditEntry(record)}
        onDelete={() => onDeleteEntry(record)}/>
        </td>
      </tr>
    )
  return (
    <div>
      <h3 className="account-management-header">
        <span id="domain-stats">
          {`${records.size} resource entries `}
        </span>
        <div className='dns-filter-wrapper'>
          <UDNButton
            id="add-dns-record"
            bsStyle="primary"
            icon={true}
            addNew={true}
            onClick={onAddEntry}>
            <IconAdd/>
          </UDNButton>
        </div>
      </h3>
      {recordTypes.sort().forEach(type => {
        if (recordsByType.hasOwnProperty(type)) {
          tables.push(
            <table className="table table-striped cell-text-left">
              <thead >
                <tr>
                  <th width="30%">HOSTNAME</th>
                  <th width="17%">RECORD TYPE</th>
                  <th width="30%">ADDRESS</th>
                  <th width="30%">TTL</th>
                  <th width="8%"></th>
                </tr>
              </thead>
              <tbody>
               {getContent(type)}
              </tbody>
            </table>
          )
        }
      })}
      {tables}
    </div>
  )
}

export default DNSList

DNSList.propTypes = {
  accountManagementModal: PropTypes.string,
  activeDomain: PropTypes.instanceOf(Map),
  activeRecordType: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  changeRecordType: PropTypes.func,
  dnsEditOnSave: PropTypes.func,
  dnsFormInitialValues: PropTypes.object,
  domains: PropTypes.instanceOf(List),
  onAddDomain: PropTypes.func,
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  soaEditOnSave: PropTypes.func,
  soaFormInitialValues: PropTypes.object,
  toggleModal: PropTypes.func
}

