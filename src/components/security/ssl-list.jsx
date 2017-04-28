import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'

import ActionButtons from '../shared/action-buttons'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import { AccountManagementHeader } from '../account-management/account-management-header'
import { formatMoment } from '../../util/helpers'

import { MODIFY_CERTIFICATE, DELETE_CERTIFICATE, CREATE_CERTIFICATE } from '../../constants/permissions'

const SSLList = ({ groups, certificates, editCertificate, deleteCertificate, uploadCertificate }) => {
  return (
    <div>
      <AccountManagementHeader
        title={`${certificates.size} Certificates`}
        onAdd={uploadCertificate}
        creationPermission={CREATE_CERTIFICATE}/>
      <table className="table table-striped cell-text-left">
        <thead>
          <tr>
            <th width="25%"><FormattedMessage id="portal.security.ssl.title.text"/></th>
            <th width="25%"><FormattedMessage id="portal.security.ssl.commonName.text"/></th>
            <th width="25%"><FormattedMessage id="portal.security.ssl.group.text"/></th>
            <th width="24%"><FormattedMessage id="portal.security.ssl.expirationDate.text"/></th>
            <IsAllowed to={MODIFY_CERTIFICATE || DELETE_CERTIFICATE}>
              <th width="1%"/>
            </IsAllowed>
          </tr>
        </thead>
        <tbody>
          {!certificates.isEmpty() ? certificates.map((cert, index) => {
            const title = cert.get('title')
            const commonName = cert.get('cn')
            const groupID = cert.get('group')
            const groupName = groups.size ? groups.filter(group => group.get('id') === groupID).first().get('name') : groupID
            const expirationDate = formatMoment(moment(cert.get('date_not_valid_after'), 'YYYYMMDDhhmmssZ'), 'L')
            const account = cert.get('account')
            return (
              <tr key={index}>
                <td>{title}</td>
                <td>{commonName}</td>
                <td>{groupName}</td>
                <td>{expirationDate}</td>
                <IsAllowed to={MODIFY_CERTIFICATE || DELETE_CERTIFICATE}>
                  <td className="nowrap-column">
                    <ActionButtons
                      permissions={{ modify: MODIFY_CERTIFICATE, delete: DELETE_CERTIFICATE }}
                      onEdit={() => !cert.get('noEdit') && editCertificate('udn', account, groupID, commonName)}
                      onDelete={() => !cert.get('noEdit') && deleteCertificate('udn', account, groupID, commonName)}/>
                  </td>
                </IsAllowed>
              </tr>
            )
          }) : (
            <tr id="empty-msg">
              <td colSpan="5">
                <FormattedMessage id="portal.security.ssl.noCertificates.text" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

SSLList.displayName = "SSLList"
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

export default injectIntl(SSLList)
