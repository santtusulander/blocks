import React, { PropTypes } from 'react'
import { List, Map, is } from 'immutable'

import { ButtonWrapper as Button } from '../button.js'
import ActionLinks from './action-links.jsx'
import IconAdd from '../icons/icon-add.jsx'
import AddSOAForm from './add-soa-form.jsx'
import Select from '../select.jsx'
import recordTypes from '../../constants/dns-record-types.js'

const DNSList = props => {
  const {
    domains,
    editEntry,
    deleteEntry,
    editSOA,
    hideModal,
    modalActive,
    onAddDomain,
    onAddEntry,
    activeDomain,
    changeRecordType,
    changeActiveDomain,
    activeRecordType } = props
  const entries = domains
    .find(domain => is(activeDomain.get('id'), domain.get('id')))
    .get('subDomains')
  const recordTypeOptions = [
    ...recordTypes.map(type => [type, type]),
    ['ALL', 'All Record Types']
  ]
  return (
    <div>
      <div className="account-management-header">
        Select Domain
        <Select
          value={activeDomain && activeDomain.get('id')}
          className='dns-dropdowns'
          onSelect={type => changeActiveDomain(type)}
          options={domains && domains.map(domain => [domain.get('id'), domain.get('name')]).toJS()}/>
        <Button bsStyle="primary" onClick={onAddDomain}>
          ADD DOMAIN
        </Button>
      </div>
      <h3 className="account-management-header">
        <span>
          {activeDomain ?
            `DNS: ${activeDomain.get('name')}: ${entries.size} resource entries ` :
            'No active Domain'}
        </span>
        {activeDomain ? <a onClick={hideModal}>Edit SOA</a> : null}
        <div className='dns-filter-wrapper'>
          <Select
            value={activeRecordType || 'ALL'}
            className='dns-dropdowns'
            onSelect={type => changeRecordType(type)}
            options={recordTypeOptions}/>
          <Button bsStyle="primary" icon={true} addNew={true} onClick={onAddEntry}>
            <IconAdd/>
          </Button>
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
          {!entries.isEmpty() ? entries.map((record, index) => {
            const id = record.get('id')
            return (
              <tr key={index}>
                <td>{record.get('hostName')}</td>
                <td>{record.get('type')}</td>
                <td>{record.get('address')}</td>
                <td>{record.get('ttl')}</td>
                <td>
                  <ActionLinks
                    onEdit={() => editEntry(id)}
                    onDelete={() => deleteEntry(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="5">No entries.</td></tr>}
        </tbody>
      </table>
      {modalActive &&
        <AddSOAForm
          domainName={activeDomain.get('name')}
          onHide={hideModal}
          onSave={editSOA}/>}
    </div>
  )
}

DNSList.propTypes = {
  activeDomain: PropTypes.instanceOf(Map),
  activeRecordType: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  changeRecordType: PropTypes.func,
  deleteEntry: PropTypes.func,
  domains: PropTypes.instanceOf(List),
  editEntry: PropTypes.func,
  editSOA: PropTypes.func,
  hideModal: PropTypes.func,
  modalActive: PropTypes.bool,
  onAddDomain: PropTypes.func,
  onAddEntry: PropTypes.func
}

export default DNSList

