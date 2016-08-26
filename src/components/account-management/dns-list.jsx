import React, { PropTypes, Component } from 'react'
import { Input } from 'react-bootstrap'
import { List, Map } from 'immutable'

import UDNButton from '../button'
import ActionLinks from './action-links'

import recordTypes from '../../constants/dns-record-types'


const records = [
  {
    class: "IN",
    name: "aaa",
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
    const { onDeleteEntry, onEditEntry, onAddEntry/*, records*/ } = this.props
    let tables = []
    let recordsByType = {}
    let filteredRecords =
      records.filter(({ name, value }) => name.includes(this.state.search) || value.includes(this.state.search))
    filteredRecords.forEach(record => {
      if(!recordsByType[record.type]) {
        recordsByType[record.type] = []
      }
      recordsByType[record.type].push(record)
    })
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
            {`${filteredRecords.length} Records`}
          </span>
          <div className='dns-filter-wrapper'>
            <Input
              type="text"
              className="search-input"
              groupClassName="search-input-group"
              placeholder="Search records"
              value={this.state.search}
              onChange={({ target: { value } }) => this.setState({ search: value })} />
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
  domains: PropTypes.instanceOf(List),
  onAddDomain: PropTypes.func,
  onAddEntry: PropTypes.func,
  onDeleteEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  toggleModal: PropTypes.func
}

