import React from 'react'

import { DNSList } from '../dns-list.jsx'

const AccountManagementSystemDNS = props => {
  return (
    <div className="account-management-system-dns">
      <DNSList
        onAddDomain={() => console.log('add domain')}
        changeActiveDomain={id => console.log('change active domain, id:', id)}
        onAddEntry={() => console.log('add entry')}
        onDeleteEntry={() => console.log('delete entry')}
        {...props}
      />
    </div>
  )
}

AccountManagementSystemDNS.displayName = 'AccountManagementSystemDNS'
AccountManagementSystemDNS.propTypes = {}

export default AccountManagementSystemDNS
