import React, { PropTypes } from 'react'
import { ButtonWrapper as Button } from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

import './account-management-header.scss'

const AccountManagementHeader = props =>
    <h2 className="account-management-header">
      <span>{props.title}</span>
      <Button bsStyle="primary" icon={true} addNew={true} onClick={props.onAdd}>
        <IconAdd/>
      </Button>
    </h2>

AccountManagementHeader.propTypes = {
  onAdd: PropTypes.func,
  title: PropTypes.string
}

export default AccountManagementHeader
