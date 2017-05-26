import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

import CaretDown from '../shared/icons/icon-caret-down'

class Accordion extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = { open: false }
  }

  componentWillReceiveProps(nextProps) {
    this.toggle(!!nextProps.items.length && !!nextProps.searchActive)
  }

  toggle(open = !this.state.open) {
    this.setState({ open })
  }

  /*eslint-disable react-intl/string-is-marked-for-translation*/
  render() {

    const { headerTitle, items } = this.props
    const active = this.state.open

    return (
      <li className={classnames('accordion', { active })}>
        <a onClick={() => this.toggle()} className="accordion-header">

          <h4 className="name-container">
            <FormattedMessage id={headerTitle} />
          </h4>
            <h4 className="entity-count-number">({items.length})<CaretDown /></h4>
        </a>
          {this.state.open &&
            <ul className='accordion-menu'>
              {items}
            </ul>}
      </li>
    )
  }
}

Accordion.propTypes = {
  headerTitle: PropTypes.string,
  items: PropTypes.array
}

Accordion.displayName = 'Accordion'
export default Accordion
