import React, { PropTypes } from 'react'
import UDNButton from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

import './account-management-header.scss'

export const AccountManagementHeader = props =>
    <h2 className="account-management-header">
      <span>{props.title}</span>
      {props.children}
      {props.onAdd &&
      <UDNButton bsStyle="success" icon={true} addNew={true} onClick={props.onAdd}>
        <IconAdd/>
      </UDNButton>}
    </h2>

AccountManagementHeader.propTypes = {
  children: PropTypes.array,
  onAdd: PropTypes.func,
  title: PropTypes.string
}

export default AccountManagementHeader
