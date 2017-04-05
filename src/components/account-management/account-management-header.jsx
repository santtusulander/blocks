import React, { PropTypes } from 'react'
import UDNButton from '../button'
import IconAdd from '../shared/icons/icon-add.jsx'
import IsAllowed from '../shared/permission-wrappers/is-allowed'

import { ALLOW_ALWAYS } from '../../constants/permissions'

export const AccountManagementHeader = props =>
  <h3 className="account-management-header">
    <span>{props.title}</span>
    {props.children}
    {props.onAdd &&
    <IsAllowed to={props.creationPermission}>
      <UDNButton bsStyle="success" icon={true} addNew={true} onClick={props.onAdd} disabled={props.disableButtons}>
        <IconAdd/>
      </UDNButton>
    </IsAllowed>}
  </h3>

AccountManagementHeader.displayName = "AccountManagementHeader"
AccountManagementHeader.defaultProps = {
  creationPermission: ALLOW_ALWAYS,
  disableButtons: false
}

AccountManagementHeader.propTypes = {
  children: PropTypes.array,
  creationPermission: PropTypes.string,
  disableButtons: PropTypes.bool,
  onAdd: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default AccountManagementHeader
