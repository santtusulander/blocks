import React, { PropTypes } from 'react'
import { List } from 'immutable'

import IconAdd from '../icons/icon-add.jsx'
import { ButtonWrapper as Button } from '../button.js'

import ActionLinks from './action-links.jsx'

export const DNSList = props => {
  const { records, editRecord, deleteRecord, editSOA, onAdd } = props
  return (
    <div>
      <h3 className="account-management-header">
        <span>{`DNS: what.is.this: ${records.size} resource records `}</span>
        <a onClick={() => editSOA(1)}>Edit SOA</a>
        <Button bsStyle="primary" icon={true} addNew={true} onClick={onAdd}>
          <IconAdd/>
        </Button>
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
          {!records.isEmpty() ? records.map((record, index) => {
            const id = record.get('id')
            return (
              <tr key={index}>
                <td>{record.get('hostName')}</td>
                <td>{record.get('type')}</td>
                <td>{record.get('address')}</td>
                <td>{record.get('ttl')}</td>
                <td>
                  <ActionLinks
                    onEdit={() => editRecord(id)}
                    onDelete={() => deleteRecord(id)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="4">No users</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

DNSList.propTypes = {
  deleteRecord: PropTypes.func,
  editRecord: PropTypes.func,
  editSOA: PropTypes.func,
  onAdd: PropTypes.func,
  records: PropTypes.instanceOf(List)
}
DNSList.defaultProps = {
  users: List()
}

