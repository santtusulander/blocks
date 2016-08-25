import React, { PropTypes, Component } from 'react'
import { Input } from 'react-bootstrap'
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

export default class DNSList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  render() {
    const { onDeleteEntry, onEditEntry, onAddEntry } = this.props
    let recordsByType = {}
    records
      .filter(({ name, value }) => name.includes(this.state.search) || value.includes(this.state.search))
      .forEach(record => {
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
            <Input
              type="text"
              className="search-input"
              groupClassName="search-input-group"
              placeholder="Search"
              value={this.state.search}
              onChange={({ target: { value } }) => this.setState({ search: value })} />
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
              <div className='table-container'>
                <h3>{type} Records</h3>
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
              </div>
            )
          }
        })}
        {tables}
      </div>
    )
  }
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

