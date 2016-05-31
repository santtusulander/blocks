import React from 'react'
import { Input } from 'react-bootstrap'
import { ButtonWrapper } from '../button.js'

import AccountManagementHeader from './account-management-header.jsx'
import RolesAddNew from './roles-add-new.jsx'

import './roles-tab.scss';

const RolesTabRow = (props) => {
  return (
    <tr className='rolesTabRow'>
        <td>
          {props.roleName}
        </td>
        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' />
          </div>
        </td>

        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' />
          </div>
        </td>

        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' />
          </div>
        </td>
    </tr>
  )
}


const RolesTab = (props) => {

  if (!props.roles || props.roles.length == 0) {
    return (
      <div>
        <p>No roles found</p>
      </div>
    )
  }

  const tableRows = props.roles.map( (role, i) => {
    return (
      <RolesTabRow key={i} { ... role } onEdit={props.onEdit} onDelete={props.onDelete}  />
    );
  });

  return (
    <div className='rolesTab'>

      <AccountManagementHeader title={ `${props.roles.length} Roles` } onAdd={props.onAdd}/>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Role</th>
            <th className='checkbox-container'>Udn</th>
            <th className='checkbox-container'>Content Provider</th>
            <th className='checkbox-container'>Service Provider</th>
          </tr>
        </thead>

        <tbody>
          { tableRows }
        </tbody>

      </table>

      <RolesAddNew show={props.showAddNewDialog} onCancel={props.onCancel} onSave={props.onSave}/>

    </div>
  )
}

export default RolesTab
