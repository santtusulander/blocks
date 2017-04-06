import React from 'react'
import { FormattedMessage } from 'react-intl'

import { AccountManagementHeader } from '../account-management-header.jsx'
import BrandEditForm from '../brand-edit-form.jsx'
import BrandListRow from './brand-list-row'

import { EDIT_BRAND } from '../../../constants/account-management-modals.js'

export const AVAILABILITY_SHARED = 'Shared'
export const AVAILABILITY_PRIVATE = 'Private'

export const BrandList = (props) => {

  const tableRows = props.brands.map((brand, i) => {
    return (
      <BrandListRow key={i} {... brand} onEdit={() => props.toggleModal(EDIT_BRAND)} onDelete={props.onDelete}  />
    );
  });

  return (
    <div className='brandList'>

      <AccountManagementHeader title={`${props.brands.length} Brands`} onAdd={() => props.toggleModal(EDIT_BRAND)}/>

      <table className="table table-striped">
        <thead>
          <tr>
            <th><FormattedMessage id="portal.brand.list.brand.text"/></th>
            <th><FormattedMessage id="portal.brand.list.availability.text"/></th>
            <th><FormattedMessage id="portal.brand.list.lastEdited.text"/></th>
            <th><FormattedMessage id="portal.brand.list.usedBy.text"/></th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          {tableRows}
        </tbody>

      </table>

      {props.accountManagementModal === EDIT_BRAND &&
        <BrandEditForm
          id="brand-edit-form"
          show={props.accountManagementModal === EDIT_BRAND}
          edit={true}
          onSave={() => {
            // no-op
          }}
          onCancel={() => props.toggleModal(null)}
          {...props.brandsFormInitialValues}
        />
        }
    </div>
  )
}

BrandList.displayName = "BrandList"
BrandList.propTypes = {
  accountManagementModal: React.PropTypes.string,
  brands: React.PropTypes.array,
  brandsFormInitialValues: React.PropTypes.object,
  onDelete: PropTypes.func,
  toggleModal: React.PropTypes.func
}
