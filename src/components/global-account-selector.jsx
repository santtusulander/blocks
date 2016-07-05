import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'

import IconSelectCaret from '../components/icons/icon-select-caret.jsx'

import './udn-admin-toolbar.scss'

class AccountSelector extends Component {
  selectOption(e) {
    console.log(e.target.getAttribute('data-value'))
  }

  sortedOptions(items) {
    return items.map( item => [item.get('id'), item.get('name')])
      .sort( (a,b) => {
        if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
        if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
        return 0
      })
  }

  render() {
    const { items, className, children } = this.props
    const cn = classnames({ className })
    return (
     <Dropdown id="" className={cn} onSelect={this.selectOption} open={true}>
      {children}
      <span className="caret-container">
        <IconSelectCaret/>
      </span>
      <Dropdown.Menu>
        {this.sortedOptions(items).map((option, i) =>
          <MenuItem key={i}>
            <span data-value={option[0]}>{option[1]}</span>
            <IconSelectCaret data-value={option[0]}/>
          </MenuItem>
        )}
      </Dropdown.Menu>
    </Dropdown>
    )
  }
}

AccountSelector.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string,
  items: PropTypes.instanceOf(List)
}

AccountSelector.defaultProps = {
  items: List()
}

export default AccountSelector
