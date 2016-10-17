import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, Nav } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import IconSelectCaret from '../components/icons/icon-select-caret'

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hiddenChildren: []
    }

    this.timeout
    this.getDOMNodeTop = this.getDOMNodeTop.bind(this)
    this.measureTabs = this.measureTabs.bind(this)
  }
  componentDidMount() {
    this.measureTabs()
    this.timeout = setTimeout(this.measureTabs, 500)
    window.addEventListener('resize', this.measureTabs)
  }
  componentWillReceiveProps() {
    this.measureTabs()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureTabs)
    clearTimeout(this.timeout)
  }
  measureTabs() {
    let hiddenChildren = []
    let visibleChildrenLength = this.props.children.length
    this.setState({ hiddenChildren: hiddenChildren })

    // Check that DOM nodes are rendered before running the calculations.
    // This is mainly for componentWillReceiveProps() event
    window.requestAnimationFrame(() => {
      if (ReactDOM.findDOMNode(this.refs.tab0) !== undefined &&
        ReactDOM.findDOMNode(this.refs.hiddenChildren) !== undefined) {

        // Compare top position of More link to the first tab child. If More link's
        // top position is bigger than first tab's, it means that all tabs don't
        // fit on same line and we need to hide some of them.
        while (this.getDOMNodeTop('hiddenChildren') > this.getDOMNodeTop('tab0') && visibleChildrenLength) {
          // Don't hide the active tab, but the one before that instead
          const childToHide = this.props.activeKey === visibleChildrenLength ?
            visibleChildrenLength - 2 : visibleChildrenLength - 1
          hiddenChildren.push(childToHide)
          this.setState({ hiddenChildren: hiddenChildren })
          visibleChildrenLength--
        }
      }
    })
  }
  getDOMNodeTop(ref) {
    return ReactDOM.findDOMNode(this.refs[ref]).getBoundingClientRect().top
  }
  render() {
    const { activeKey, children, className, onSelect } = this.props
    return (
      <Nav bsStyle="tabs" className={className} activeKey={activeKey} onSelect={onSelect}>
        {children.map((element, i) => {
          if(!this.state.hiddenChildren.includes(i)) {
            return React.cloneElement(
              element, {
                ref: `tab${i}`,
                key: i
              }
            )
          }
        })}
        <li ref="hiddenChildren">
          {this.state.hiddenChildren.length !== 0 ?
            <Dropdown id="nav-dropdown-within-tab" pullRight={true}>
              <Dropdown.Toggle bsStyle="link" noCaret={true}>
                <FormattedMessage id="portal.common.MORE.text"/>
                <IconSelectCaret/>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-wide-menu">
                {children.map((element, i) => {
                  if(this.state.hiddenChildren.includes(i)) {
                    return React.cloneElement(
                      element, {
                        key: i,
                        onClick: () => onSelect(i + 1)
                      }
                    )
                  }
                })}
              </Dropdown.Menu>
            </Dropdown>
          : null}
        </li>
      </Nav>
    );
  }
}

Tabs.displayName = 'Tabs'
Tabs.propTypes = {
  activeKey: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  onSelect: PropTypes.func
};

module.exports = Tabs;
