import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'
import { List } from 'immutable'

import ActionLinks from '../account-management/action-links.jsx'
import { AccountManagementHeader } from '../account-management/account-management-header.jsx'

const SSLList = ({ groups, activeCertificates, certificates, onCheck, editCertificate, deleteCertificate, uploadCertificate }) => {
  return (
    <div>
      <AccountManagementHeader title={`${certificates.size} Certificates`} onAdd={uploadCertificate}/>
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="30%">
              <Input type="checkbox"
                label="TITLE"
                onChange={() => onCheck('all')}
                checked={false}/>
            </th>
            <th width="30%">COMMON NAME</th>
            <th width="30%">GROUP</th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          {!certificates.isEmpty() ? certificates.map((cert, index) => {
            const commonName = cert.get('cn')
            const group = groups.size ? groups.filter(group => group.get('id') === cert.get('group')).first().get('name') : cert.get('group')
            const account = cert.get('account')
            return (
              <tr key={index}>
                <td>
                  <Input type="checkbox"
                    onChange={() => onCheck(commonName)}
                    label={cert.get('title') || 'NEEDS API'}
                    checked={activeCertificates.includes(commonName)}/>
                </td>
                <td>{commonName}</td>
                <td>{group}</td>
                <td>
                  <ActionLinks
                    onEdit={() => !cert.get('noEdit') && editCertificate('udn', account, group, commonName)}
                    onDelete={() => !cert.get('noEdit') && deleteCertificate('udn', account, group, commonName)}/>
                </td>
              </tr>
            )
          }) : <tr id="empty-msg"><td colSpan="4">No certificates</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

SSLList.propTypes = {
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  certificates: PropTypes.instanceOf(List),
  deleteCertificate: PropTypes.func,
  editCertificate: PropTypes.func,
  onCheck: PropTypes.func,
  uploadCertificate: PropTypes.func
}
SSLList.defaultProps = {
  certificates: List()
}

export default SSLList
