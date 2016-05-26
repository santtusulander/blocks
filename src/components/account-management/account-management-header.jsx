import React from 'react'
import { ButtonWrapper } from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

const AccountManagementHeader = (props) => {
  return (
    <h3 className='accountManagementHeader'>
      <span>{props.title}</span>
      <ButtonWrapper bsStyle='btn-primary' icon='true' addNew='true' onClick={props.onAdd}>
        <IconAdd />
      </ButtonWrapper>
    </h3>
  )
}

export default AccountManagementHeader
