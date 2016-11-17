import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import ActionButtons from '../action-buttons'
import { AccountManagementHeader } from '../account-management/account-management-header'

import { MODIFY_CERTIFICATE, DELETE_CERTIFICATE, CREATE_CERTIFICATE } from '../../constants/permissions'

const SSLList = ({ groups, certificates, editCertificate, deleteCertificate, uploadCertificate }) => {
  return (
    <div>
      <AccountManagementHeader
        title={`${certificates.size} Certificates`}
        onAdd={uploadCertificate}
        creationPermission={CREATE_CERTIFICATE}/>
      <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="30%"><FormattedMessage id="portal.security.ssl.commonName.text"/></th>
            <th width="30%"><FormattedMessage id="portal.security.ssl.group.text"/></th>
            <th width="1%" />
          </tr>
        </thead>
        <tbody>
          {!certificates.isEmpty() ? certificates.map((cert, index) => {
            const commonName = cert.get('cn')
            const groupID = cert.get('group')
            const groupName = groups.size ? groups.filter(group => group.get('id') === groupID).first().get('name') : groupID
            const account = cert.get('account')
            return (
              <tr key={index}>
                <td>{commonName}</td>
                <td>{groupName}</td>
                <td className="nowrap-column">
                  <ActionButtons
                    permissions={{ modify: MODIFY_CERTIFICATE, delete: DELETE_CERTIFICATE }}
                    onEdit={() => !cert.get('noEdit') && editCertificate('udn', account, groupID, commonName)}
                    onDelete={() => !cert.get('noEdit') && deleteCertificate('udn', account, groupID, commonName)}/>
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
  certificates: PropTypes.instanceOf(List),
  deleteCertificate: PropTypes.func,
  editCertificate: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  uploadCertificate: PropTypes.func
}
SSLList.defaultProps = {
  certificates: List()
}

export default SSLList
