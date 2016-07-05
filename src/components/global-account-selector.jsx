import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'

import IconSelectCaret from './icons/icon-select-caret.jsx'

class AccountSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secondaryMenuActive: false
    }
  }

  selectOption(e) {
    console.log(e.target)
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
    const { items, className, children, secondaryMenu } = this.props
    const cn = classnames({ className })
    return (
      <div>
       <Dropdown id="" className={cn} onSelect={this.selectOption} open={true}>
        {children}
        <span className="caret-container">
          <IconSelectCaret/>
        </span>
        <Menu items={this.sortedOptions(items)} showCaret={secondaryMenu}/>
      </Dropdown>
      <Dropdown id="" className={cn} onSelect={this.selectOption} open={this.state.secondaryMenuActive}>
        <Menu items={this.sortedOptions(items)} showCaret={false}/>
      </Dropdown>
    </div>
    )
  }
}

const Menu = ({ items, showCaret }) => {
  return (
      <Dropdown.Menu>
        <Input className="header-search-input" type="text" placeholder="Search" />
        {items.map((option, i) =>
          <MenuItem key={i}>
            <span data-value={option[0]}>{option[1]}</span>
            {showCaret &&
              <span className="caret-container" data-value={option[1]}>
                <IconSelectCaret/>
              </span>}
          </MenuItem>
        )}
      </Dropdown.Menu>
  )
}

AccountSelector.propTypes = {
  className: PropTypes.string,
  items: PropTypes.instanceOf(List)
}

AccountSelector.defaultProps = {
  items: List()
}

export default AccountSelector
