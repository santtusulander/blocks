/* eslint-disable react/no-find-dom-node */
// It is acceptible to use ReactDOM.findDOMNode, since it is not deprecated.
// react/no-find-dom-node is designed to avoid use of React.findDOMNode and
// Component.getDOMNode

import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'

import IconSelectCaret from '../icons/icon-select-caret'

/**
 * Get DOM node top position
 * @param ref
 * @returns {Number}
 */
function getDOMNodeTop(ref) {
  if (!ref) {
    return 0
  }
  return findDOMNode(ref).getBoundingClientRect().top
}

class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hiddenTabs: []
    }

    this.tabElements = []
    this.hiddenTabsElement = null

    this.timeout = null
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
    if (!this.props.children || !this.props.children.length) {
      return
    }

    const hiddenTabs = []
    this.setState({ hiddenTabs: hiddenTabs })
    const reverseTabs = this.props.children.slice().reverse()

    // Check that DOM nodes are rendered before running the calculations.
    // This is mainly for componentWillReceiveProps() event
    window.requestAnimationFrame(() => {
      if (this.tabElements.length && this.hiddenTabsElement) {

        // Compare top position of More link to the first tab child. If More link's
        // top position is bigger than first tab's, it means that all tabs don't
        // fit on same line and we need to hide some of them. Looping through
        // tabs in reverse since we start hiding them from the end
        reverseTabs.forEach((tab, i) => {
          if (getDOMNodeTop(this.hiddenTabsElement) > getDOMNodeTop(this.tabElements[0])) {
            // Don't hide active tab
            if (tab.props['data-eventKey'] !== this.props.activeKey) {
              hiddenTabs.push(this.props.children.length - 1 - i)
              this.setState({ hiddenTabs: hiddenTabs })
            }
          }
        })
      }
    })
  }

  render() {
    const { className, onSelect } = this.props
    const { hiddenTabs } = this.state
    const children = Array.isArray(this.props.children)
                     ? this.props.children.filter(item => item)
                     : this.props.children

    return (
      <ul role="tablist" className={classnames('nav nav-tabs', className)}>
        {children && children.length > 1 ?
          children.filter((tab, i) => !hiddenTabs.includes(i)).map((tab, i) => {
            return React.cloneElement(
              tab, {
                ref: (tabEl) => {
                  this.tabElements[i] = tabEl
                },
                key: i
              }
            )
          })
          : children
        }
        <li ref={(node) => {
          this.hiddenTabsElement = node
        }}>
          {hiddenTabs.length !== 0 ?
            <Dropdown id="nav-dropdown-within-tab" pullRight={true}>
              <Dropdown.Toggle className="tabs-dropdown-toggle" noCaret={true}>
                <FormattedMessage id="portal.common.MORE.text"/>
                <IconSelectCaret/>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-wide-menu">
                {children.concat().map((tab, i) => {
                  if (hiddenTabs.includes(i)) {
                    return React.cloneElement(
                      tab, {
                        key: i,
                        onClick: () => onSelect && onSelect(tab.props['data-eventKey'])
                      }
                    )
                  }

                  return false
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
