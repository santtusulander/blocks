import React, { Component, PropTypes } from 'react'

import { DNSList } from '../dns-list.jsx'

class AccountManagementSystemDNS extends Component {
  render() {
    <div className="account-management-system-dns">
      <DNSList
        onAddDomain={() => console.log('add domain')}
        changeActiveDomain={id => console.log('change active domain, id:', id)}
        onAddEntry={() => console.log('add entry')}
        onDeleteEntry={() => console.log('delete entry')}
        {...this.props}
      />
    </div>
  }
}

AccountManagementSystemDNS.propTypes = {}

export default AccountManagementSystemDNS
