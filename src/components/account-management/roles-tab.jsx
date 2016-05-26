import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { ButtonWrapper } from '../button.js'

import AccountManagementHeader from './account-management-header.jsx'

import './roles-tab.scss';

const RolesTabRow = (props) => {
  return (
    <tr className='RolesTabRow'>
        <td>
          {props.roleName}
        </td>
        <td>
          < label='aaa'/>
        </td>

        <td>
          <Checkbox />
        </td>

        <td>
            <Checkbox />
        </td>
    </tr>
  )
}


const RolesTab = (props) => {

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
            <th>Udn</th>
            <th>Content Provider</th>
            <th>Service Provider</th>
          </tr>
        </thead>

        <tbody>
          { tableRows }
        </tbody>

      </table>
    </div>
  )
}

export default RolesTab
