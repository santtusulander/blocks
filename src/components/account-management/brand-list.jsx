import React from 'react'
import { ButtonWrapper } from '../button.js'

import ActionLinks from './action-links.jsx'
import AccountManagementHeader from './account-management-header.jsx'

import './brand-list.scss';

const AVAILABILITY_SHARED = 'Shared'
const AVAILABILITY_PRIVATE = 'Private'

const BrandListRow = (props) => {
  return (
    <tr className='brandListRow'>
      <td>
        <span className='brandLogoThumb'>
          {props.logo}
        </span>

        {props.brand}
      </td>
      <td>
        {props.availability}
      </td>
      <td>
        {props.lastEdited}
      </td>
      <td>
        <BrandlistUsedBy fieldVal={props.usedBy} />
      </td>
      <td>
        <ActionLinks onEdit={ () => props.onEdit(props.id) } onDelete={ () => props.onDelete(props.id) }  />
      </td>
    </tr>
  )
}

BrandListRow.propTypes = {
  logo: React.PropTypes.string,
  brand: React.PropTypes.string,
  availability: React.PropTypes.string,
  last_edited: React.PropTypes.string,
  usedBy: React.PropTypes.string
}

const BrandlistUsedBy = (props) => {
  let content

  if ( Array.isArray(props.fieldVal) ) {
    content = props.fieldVal.map( ( item ) => {
      return (
        <a>{item.accountName}</a>
      )
    });

  } else {
    content = props.fieldVal
  }

  return (
    <span>
      { content }
    </span>
  )
}

const BrandList = (props) => {

  const tableRows = props.brands.map( (brand, i) => {
    return (
      <BrandListRow key={i} { ... brand } onEdit={props.onEdit} onDelete={props.onDelete}  />
    );
  });

  return (
    <div className='brandList'>

      <AccountManagementHeader title={ `${props.brands.length} Brands` } />

      <table className="table table-striped table-analysis">

        <thead>
          <tr>
            <th>Brand</th>
            <th>Availability</th>
            <th>Last Edited</th>
            <th>Used By</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          { tableRows }
        </tbody>

      </table>
    </div>
  )
}

module.exports = {
  BrandList,
  BrandListRow,
  AVAILABILITY_SHARED,
  AVAILABILITY_PRIVATE
};

BrandList.propTypes = {
  brands: React.PropTypes.array
}


