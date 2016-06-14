import React from 'react'
import {
  BrandList,
  AVAILABILITY_PRIVATE,
  AVAILABILITY_SHARED,
  }  from '../brand-list.jsx'

const fakeBrands = [
  {id: 1, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 2, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: [{accountName: 'Account Name #2'},{accountName: 'Account Name #3'}] },
  {id: 3, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 4, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: 'Account Name #1'}
]


class AccountManagementSystemBrands extends React.Component {
  render() {
    return (
      <div className="account-management-system-brands">
        <BrandList {...this.props} brands={fakeBrands} />
      </div>
    )
  }
}

AccountManagementSystemBrands.displayName = 'AccountManagementSystemBrands'
AccountManagementSystemBrands.propTypes = {}

module.exports = AccountManagementSystemBrands
