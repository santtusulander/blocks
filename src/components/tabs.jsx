/* eslint-disable react/no-find-dom-node */
// It is acceptible to use ReactDOM.findDOMNode, since it is not deprecated.
// react/no-find-dom-node is designed to avoid use of React.findDOMNode and
// Component.getDOMNode

import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'

import IconSelectCaret from '../components/icons/icon-select-caret'

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hiddenTabs: []
    }

    this.timeout = null
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
    if (!this.props.children || !this.props.children.length) return

    let hiddenTabs = []
    this.setState({ hiddenTabs: hiddenTabs })
    let reverseTabs = this.props.children.slice().reverse()

    // Check that DOM nodes are rendered before running the calculations.
    // This is mainly for componentWillReceiveProps() event
    window.requestAnimationFrame(() => {
      if (findDOMNode(this.refs['tab0']) != null &&
        findDOMNode(this.refs['hiddenTabs']) != null) {

        // Compare top position of More link to the first tab child. If More link's
        // top position is bigger than first tab's, it means that all tabs don't
        // fit on same line and we need to hide some of them. Looping through
        // tabs in reverse since we start hiding them from the end
        reverseTabs.forEach((tab, i) => {
          if (this.getDOMNodeTop('hiddenTabs') > this.getDOMNodeTop('tab0')) {
            // Don't hide active tab
            if(tab.props['data-eventKey'] !== this.props.activeKey) {
              hiddenTabs.push(this.props.children.length - 1 - i)
              this.setState({ hiddenTabs: hiddenTabs })
            }
          }
        })
      }
    })
  }
  getDOMNodeTop(ref) {
    return findDOMNode(this.refs[ref]).getBoundingClientRect().top
  }
  render() {
    const { className, onSelect } = this.props
    const children = this.props.children.filter(item => item)

    return (
      <ul role="tablist" className={classnames('nav nav-tabs', className)}>
        {children && children.length > 1 ?
          children.filter((tab, i) => !this.state.hiddenTabs.includes(i)).map((tab, i) => {
            return React.cloneElement(
              tab, {
                ref: `tab${i}`,
                key: i
              }
            )
          })
          : children
        }
        <li ref="hiddenTabs">
          {this.state.hiddenTabs.length !== 0 ?
            <Dropdown id="nav-dropdown-within-tab" pullRight={true}>
              <Dropdown.Toggle className="tabs-dropdown-toggle" noCaret={true}>
                <FormattedMessage id="portal.common.MORE.text"/>
                <IconSelectCaret/>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-wide-menu">
                {children.concat().map((tab, i) => {
                  if (this.state.hiddenTabs.includes(i)) {
                    return React.cloneElement(
                      tab, {
                        key: i,
                        onClick: () => onSelect && onSelect(tab.props['data-eventKey'])
                      }
                    )
                  }
                })}
              </Dropdown.Menu>
            </Dropdown>
          : null}
        </li>
      </ul>
    );
  }
}

Tabs.displayName = 'Tabs'
Tabs.propTypes = {
  activeKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  onSelect: PropTypes.func
};

module.exports = Tabs;
