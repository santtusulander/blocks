import React, { PropTypes } from 'react'
import UDNButton from '../button'
import IconAdd from '../icons/icon-add.jsx'
import IsAllowed from '../is-allowed'

import { ALLOW_ALWAYS } from '../../constants/permissions'

import './account-management-header.scss'

export const AccountManagementHeader = props =>
  <h3 className="account-management-header">
    <span>{props.title}</span>
    {props.children}
    {props.onAdd &&
    <IsAllowed to={props.creationPermission}>
      <UDNButton bsStyle="success" icon={true} addNew={true} onClick={props.onAdd}>
        <IconAdd/>
      </UDNButton>
    </IsAllowed>}
  </h3>

AccountManagementHeader.defaultProps = {
  creationPermission: ALLOW_ALWAYS
}

AccountManagementHeader.propTypes = {
  children: PropTypes.array,
  creationPermission: PropTypes.string,
  onAdd: PropTypes.func,
  title: PropTypes.string
}

export default AccountManagementHeader
