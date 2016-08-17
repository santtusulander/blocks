import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem, Input } from 'react-bootstrap'

import { findDOMNode } from 'react-dom'

export const autoClose = WrappedComponent => {
  class AutoClose extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
      }
      this.close = this.close.bind(this)
      this.handleClick = this.handleClick.bind(this)
    }

    componentWillMount() {
      document.addEventListener('click', this.handleClick, false)
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClick, false)
      this.props.close && this.props.close()
    }

    handleClick(e) {
      if (findDOMNode(this).contains(e.target)) {
        return
      }

      if (this.props.open || this.state.open) {
        this.close()
      }
    }

    close() {
      if(this.props.close) {
        this.props.close()
      } else {
        this.setState({ open: !this.state.open })
      }
    }

    render() {
      let newProps = {}
      if(this.props.open === undefined) {
        newProps.open = this.state.open
        newProps.onItemClick = value => {
          this.props.onItemClick(value)
          this.setState({ open: !this.state.open })
        }
      }
      if(!this.props.toggle) {
        newProps.toggle = () => this.setState({ open: !this.state.open })
      }
      return (<WrappedComponent {...this.props}{...newProps}/>)
    }
  }
  AutoClose.propTypes = {
    close: PropTypes.func,
    onItemClick: PropTypes.func,
    open: PropTypes.bool,
    toggle: PropTypes.func
  }
  return AutoClose
}


const AccountSelector = ({
  items,
  drillable,
  children,
  onSelect,
  open,
  toggle,
  topBarText,
  searchValue,
  onSearch,
  onCaretClick,
  onItemClick,
  onTopbarClick }) =>
  <Dropdown id="" onSelect={onSelect} open={open} onToggle={() => {/*noop*/}} className="global-account-selector">
    <div className="global-account-selector__toggle" bsRole="toggle" onClick={toggle}>{children}</div>
    <Dropdown.Menu>
      <MenuItem>
        <Input
          className="header-search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={onSearch}/>
      </MenuItem>
      {topBarText && <MenuItem onClick={onTopbarClick}><span className="top-bar-link">{topBarText}</span></MenuItem>}
      {items.map((option, i) =>
        <MenuItem key={i} id="menu-item">
          <span id="name" className="name" onClick={() => onItemClick(option[0])}>{option[1]}</span>
          {drillable &&
            <span className="caret-container" onClick={() => onCaretClick(option[0])}>
              <span className="caret"></span>
            </span>}
        </MenuItem>
      )}
    </Dropdown.Menu>
  </Dropdown>

AccountSelector.propTypes = {
  children: PropTypes.object,
  classname: PropTypes.string,
  drillable: PropTypes.bool,
  items: PropTypes.array,
  onCaretClick: PropTypes.func,
  onItemClick: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  onTopbarClick: PropTypes.func,
  open: PropTypes.bool,
  searchValue: PropTypes.string,
  toggle: PropTypes.func,
  topBarText: PropTypes.string
}

export default autoClose(AccountSelector)
