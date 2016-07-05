import React, { Component } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { List, Map } from 'immutable'

import Select from '../select.jsx'
import './udn-admin-toolbar.scss'

class AccountSelector extends Component {
  render() {
    const accountOptions = accounts.map( account => [account.get('id'), account.get('name')])
      .sort( (a,b) => {
        if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
        if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
        return 0
      })
    return (
     <Dropdown id="" className={className} onSelect={this.selectOption} open>
        <Dropdown.Menu>
          {this.props.options.map((options, i) =>
            <MenuItem key={i} data-value={options[0]}
              className={this.props.value === options[0] && 'hidden'}>
              {options[1]}
            </MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

UdnAdminToolbar.defaultProps = {
  accounts: List(),
  activeAccount: Map()
}

export default AccountSelector
