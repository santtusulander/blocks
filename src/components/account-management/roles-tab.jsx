import React from 'react'
import { Input } from 'react-bootstrap'



import { AccountManagementHeader } from './account-management-header.jsx'
import RolesEditForm from './roles-edit-form.jsx'

import { ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER } from '../../constants/roles.js'

import './roles-tab.scss';

const RolesTabRow = (props) => {

  const { role } = props

  return (
    <tr className='rolesTabRow'>
        <td>
          { role.get('roleName') }
        </td>
        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' checked={ role.get('roles').contains( ROLE_UDN ) } />
          </div>
        </td>

        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' checked={ role.get('roles').contains( ROLE_CONTENT_PROVIDER ) } />
          </div>
        </td>

        <td>
          <div className='checkbox-container'>
            <Input type='checkbox' label=' ' checked={ role.get('roles').contains( ROLE_SERVICE_PROVIDER ) } />
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
      <RolesTabRow key={i} { ... role } role={ role } onEdit={props.onEdit} onDelete={props.onDelete}  />
    );
  });

  return (
    <div className='rolesTab'>

      <AccountManagementHeader title={ `${props.roles.count() } Roles` } onAdd={props.onAdd}/>

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

      <RolesEditForm show={props.showAddNewDialog} onCancel={props.onCancel} onSave={props.onSave}/>

    </div>
  )
}

export default RolesTab
