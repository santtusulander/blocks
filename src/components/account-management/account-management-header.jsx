import React, { PropTypes } from 'react'
import { ButtonWrapper as Button } from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

const AccountManagementHeader = props =>
    <h3 className="account-management-header">
      <span>{props.title}</span>
      {props.children}
      <Button bsStyle="primary" icon={true} addNew={true} onClick={props.onAdd}>
        <IconAdd/>
      </Button>
    </h3>

AccountManagementHeader.propTypes = {
  children: PropTypes.array,
  onAdd: PropTypes.func,
  title: PropTypes.string
}

export default AccountManagementHeader
