import React from 'react'
import moment from 'moment'
import ActionLinks from './action-links.jsx'
import { AccountManagementHeader } from './account-management-header.jsx'
import BrandEditForm from './brand-edit-form.jsx'

const AVAILABILITY_SHARED = 'Shared'
const AVAILABILITY_PRIVATE = 'Private'
import { EDIT_BRAND } from '../../constants/account-management-modals.js'

const BrandListRow = (props) => {
  return (
    <tr className='brandListRow'>
      <td>
        <span className='brandLogoThumb'>
          { /* props.logo */}
          <img width='60' src='data:image/png;base64,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' />
        </span>

        {props.brand}
      </td>
      <td>
        {props.availability}
      </td>
      <td>
        {moment(props.lastEdited).format('MM/DD/YYYY, h:mm a')}
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
    return (
      <a>
        {props.fieldVal.length} accounts
      </a>

      /* TODO: create a tooltip
      content = props.fieldVal.map( ( item ) => {
       return (
       <a>{item.accountName}</a>
       )
       }); */

    )
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

  const brandsFormInitialValues = {}

  const tableRows = props.brands.map( (brand, i) => {
    return (
      <BrandListRow key={i} { ... brand } onEdit={() => props.toggleModal(EDIT_BRAND)} onDelete={props.onDelete}  />
    );
  });

  return (
    <div className='brandList'>

      <AccountManagementHeader title={ `${props.brands.length} Brands` } onAdd={() => props.toggleModal(EDIT_BRAND)}/>

      <table className="table table-striped">
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

      {props.accountManagementModal === EDIT_BRAND &&
        <BrandEditForm
          id="brand-edit-form"
          show={props.accountManagementModal === EDIT_BRAND}
          edit={true}
          onSave={() => {console.log("onSave()")} }
          onCancel={() => props.toggleModal(null)}
          { ...brandsFormInitialValues }
        />
        }
    </div>
  )
}

BrandList.propTypes = {
  accountManagementModal: React.PropTypes.string,
  brands: React.PropTypes.array,
  brandsFormInitialValues: React.PropTypes.object,
  toggleModal: React.PropTypes.func,
}

module.exports = {
  BrandList,
  BrandListRow,
  AVAILABILITY_SHARED,
  AVAILABILITY_PRIVATE
};


