import React, { PropTypes, Component } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import TruncatedTitle from './truncated-title'
import CustomToggle from '../form-elements/customToggle'

import IconContextMenu from '../icons/icon-context-menu'
import MenuItemDownload from './menu-item-download'

class ContextMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    }
    this.showMenu = this.showMenu.bind(this)
  }
  showMenu() {
    this.setState({showMenu: true})
  }

  render() {
    const { header, options, disabled, params } = this.props
    const { showMenu } = this.state
    return (
      <Dropdown className="menu" id="context-menu" pullRight={true} disabled={disabled}>
        <CustomToggle bsRole="toggle" onClick={this.showMenu}>
          <IconContextMenu className="storage-contents-context-menu-icon" />
        </CustomToggle>
        <Dropdown.Menu className="context-menu">
        <MenuItem className="menu-header">
          <div className="header-title">
            <TruncatedTitle content={header}/>
          </div>
          <IconContextMenu/>
        </MenuItem>
          {/*Only fetch download url when the menu is opened. Without this check, it will
            fetch every published url of every file*/}
          {showMenu && options.map(({label, handleClick, isDownloadButton}, index) => {
            if (isDownloadButton) {
              return (<MenuItemDownload key={index} label={label} name={header} params={params}/>)
            }
            return (
                  <MenuItem
                    key={index}
                    onClick={e => {
                      e.stopPropagation()
                      handleClick()
                    }}
                  >
                    {label}
                  </MenuItem>
            )
          })}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}


ContextMenu.displayName = 'ContextMenu'

ContextMenu.defaultProps = {
  options: []
}

ContextMenu.propTypes = {
  disabled: PropTypes.bool,
  header: PropTypes.string,
  options: PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.node ]).isRequired,
      handleClick: React.PropTypes.func
    })
  ).isRequired,
  params: PropTypes.object
}
export default ContextMenu
