import React from 'react'
import { ButtonWrapper } from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

import './account-management-header.scss'

const AccountManagementHeader = (props) => {
  return (
    <h2 className='accountManagementHeader'>
      <span>{props.title}</span>
      <ButtonWrapper bsStyle='btn-primary' icon='true' addNew='true' onClick={props.onAdd}>
        <IconAdd />
      </ButtonWrapper>
    </h2>
  )
}

export default AccountManagementHeader
