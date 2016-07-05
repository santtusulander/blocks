import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'
import classnames from 'classnames'
import { List } from 'immutable'
import { connect } from 'react-redux'

import IconSelectCaret from './icons/icon-select-caret.jsx'

class AccountSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      secondaryMenuActive: false
    }
    this.selectOption = this.selectOption.bind(this)
  }

  selectOption(e) {
    const { tier, activeItem, onSelect, fetchSecondaryItems } = this.props
    if(e.target.id === 'name') {
      this.setState({ open: !this.state.open })
      onSelect(e.target.getAttribute('data-value'))
    } else {
      this.setState({ secondaryMenuActive: true })
      fetchSecondaryItems(tier, params)
    }
  }

  sortedOptions(items) {
    return items.sort((a,b) => {
      if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
      if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
      return 0
    })
  }

  render() {
    const { ...menuProps } = this.props
    const classname = classnames({ classname })
    return (
      <Menu
        {...menuProps}
        toggle={() => this.setState({ open: !this.state.open })}
        open={this.state.open}
        onSelect={this.selectOption}/>
    )
  }
}

const Menu = ({ items, drillable, classname, children, onSelect, open, toggle }) => {
  return (
     <Dropdown id="" className={classname} onSelect={onSelect} open={open}>
        <span bsRole="toggle" onClick={toggle}>{children}</span>
        <span className="caret-container">
          <IconSelectCaret/>
        </span>
        <Dropdown.Menu>
          <Input className="header-search-input" type="text" placeholder="Search" />
          {items.map((option, i) =>
            <MenuItem key={i}>
              <span id="name" data-value={option[0]}>{option[1]}</span>
              {drillable &&
                <span className="caret-container" data-value={option[1]}>
                  <IconSelectCaret/>
                </span>}
            </MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
  )
}

AccountSelector.propTypes = {
  className: PropTypes.string,
  items: PropTypes.instanceOf(List)
}

AccountSelector.defaultProps = {
  items: List()
}

function mapStateToProps(state, ownProps) {
  return {

  }
}

function mapDispatchToProps(dispatch, ownProps) {
  function fetchSecondaryItems(tier, params) {
    switch(tier) {
      case 'account': fetchAccounts('udn')
      case 'group': fetchHosts('udn', params.account, params.group, params.property)
      case 'property': fetchAccounts('udn', params.account, params.group, params.property)
    }
  }
  return {
    fetchSecondaryItems:
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);
