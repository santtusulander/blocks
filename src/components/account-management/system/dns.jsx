import React from 'react'

import DNSList from '../dns-list.jsx'
/*
const fakeEntries = fromJS([
  {id: 1, hostName: 'aaa.com', type: 'A', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 2, hostName: 'aaa.com', type: 'AAAA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 3, hostName: 'aaa.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 4, hostName: 'aaa.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 5, hostName: 'aaa.com', type: 'TXT', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'}
])

const fakeDomains = fromJS([
  {id: 1, name: 'ccc.com'},
  {id: 2, name: 'bbb.com'},
  {id: 3, name: 'kung-fu.com'},
  {id: 4, name: 'abba.com'},
  {id: 5, name: 'aaa.com'}
])

const activeDomain = { name: 'kung-fu.com', id: 3 }
*/

const AccountManagementSystemDNS = props => {
  return (
    <div className="account-management-system-dns">
      <DNSList
        onAddDomain={() => console.log('add domain')}
        changeActiveDomain={() => console.log('change active domain')}
        onAddEntry={() => console.log('add entry')}
        deleteEntry={() => console.log('delete entry')}
        {...props}
      />
    </div>
  )
}

AccountManagementSystemDNS.displayName = 'AccountManagementSystemDNS'
AccountManagementSystemDNS.propTypes = {}

export default AccountManagementSystemDNS
