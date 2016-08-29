import React, { PropTypes } from 'react'
import { List, Map, is } from 'immutable'

import UDNButton from '../button'
import ActionLinks from './action-links'
import IconAdd from '../icons/icon-add'
import Select from '../select'

import recordTypes from '../../constants/dns-record-types'
import { EDIT_SOA, EDIT_DNS } from '../../constants/account-management-modals'

const DNSList = props => {
  const {
    domains,
    onDeleteEntry,
    activeDomain,
    changeRecordType,
    activeRecordType,
    toggleModal
  } = props
  const entries = activeDomain && domains
    .find(domain => is(activeDomain.get('id'), domain.get('id')))
    .get('subDomains')
    .filter(entry => !activeRecordType || entry.get('type') === activeRecordType)
  const recordTypeOptions = [
    [null, 'All Record Types'],
    ...recordTypes.map(type => [type, type])
  ]
  return (
    <div className="container-fluid content-container">
      <h3 className="account-management-header">
        <span id="domain-stats">
          {activeDomain ?
            `DNS: ${activeDomain.get('name')}: ${entries.size} resource entries ` :
            'No active Domain'}
        </span>
        {activeDomain && <a id="edit-soa" onClick={() => toggleModal(EDIT_SOA)}>Edit SOA</a>}
        <div className='dns-filter-wrapper'>
          <Select
            value={activeRecordType || null}
            className="dns-dropdowns"
            onSelect={type => changeRecordType(type)}
            options={recordTypeOptions}/>
          <UDNButton
            id="add-dns-record"
            bsStyle="success"
            icon={true}
            addNew={true}
            onClick={() => toggleModal(EDIT_DNS)} >
            <IconAdd/>
          </UDNButton>
        </div>
      </h3>
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
          {entries && !entries.isEmpty() ? entries.map((record, index) => {
            const id = record.get('id')
            return (
              <tr key={index}>
                <td>{record.get('hostName')}</td>
                <td>{record.get('type')}</td>
                <td>{record.get('address')}</td>
                <td>{record.get('ttl')}</td>
                <td>
                  <ActionLinks
                    onEdit={() => toggleModal(EDIT_DNS)}
                    onDelete={() => onDeleteEntry(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="5">No entries.</td></tr>}
        </tbody>
      </table>
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
