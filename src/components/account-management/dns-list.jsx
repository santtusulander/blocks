import React, { PropTypes } from 'react'
import { List, Map, is } from 'immutable'

import { ButtonWrapper as Button } from '../button.js'
import ActionLinks from './action-links.jsx'
import IconAdd from '../icons/icon-add.jsx'
import SoaEditForm from './dns-soa-form.jsx'
import DnsEditForm from './dns-edit-form.jsx'

import Select from '../select.jsx'
import recordTypes from '../../constants/dns-record-types.js'
import { EDIT_SOA, EDIT_DNS } from '../../constants/account-management-modals.js'

export const DNSList = props => {
  const {
    domains,
    deleteEntry,
    soaEditOnSave,
    dnsEditOnSave,
    onAddDomain,
    activeDomain,
    changeRecordType,
    changeActiveDomain,
    activeRecordType,
    toggleModal,
    accountManagementModal,
    soaFormInitialValues,
    dnsFormInitialValues
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
    <div>
      <div className="account-management-header">
        Select Domain
        <Select
          value={activeDomain && activeDomain.get('id')}
          className="dns-dropdowns"
          onSelect={id => (changeActiveDomain(id))}
          options={domains && domains.map(domain => [domain.get('id'), domain.get('name')]).toJS()}/>
        <Button id="add-domain" bsStyle="primary" onClick={onAddDomain}>
          <strong>ADD DOMAIN</strong>
        </Button>
      </div>
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
          <Button
            id="add-dns-record"
            bsStyle="primary"
            icon={true}
            addNew={true}
            onClick={() => toggleModal(EDIT_DNS)} >
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
                    onDelete={() => deleteEntry(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="5">No entries.</td></tr>}
        </tbody>
      </table>
      { accountManagementModal === EDIT_DNS &&
        <DnsEditForm
          { ...props.dnsInitialValues }
          show={accountManagementModal === EDIT_DNS}
          edit={ true }
          domain='foobar.com'
          onSave={props.dnsEditOnSave}
          onCancel={() => toggleModal(null)}
        />
      }

      {accountManagementModal === EDIT_SOA &&
        <SoaEditForm
          id="soa-form"
          onCancel={() => toggleModal(null)}
          activeDomain={activeDomain}
          onSave={soaEditOnSave}
          { ...soaFormInitialValues }
          />}
    </div>
  )
}

DNSList.propTypes = {
  accountManagementModal: PropTypes.string,
  activeDomain: PropTypes.instanceOf(Map),
  activeRecordType: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  changeRecordType: PropTypes.func,
  deleteEntry: PropTypes.func,
  dnsEditOnSave: PropTypes.func,
  dnsFormInitialValues: PropTypes.object,
  domains: PropTypes.instanceOf(List),
  onAddDomain: PropTypes.func,
  onAddEntry: PropTypes.func,
  soaEditOnSave: PropTypes.func,
  soaFormInitialValues: PropTypes.object,
  toggleModal: PropTypes.func
}

