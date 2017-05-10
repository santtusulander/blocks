import React, { Component } from 'react'

class Accordion extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = { open: false }
  }

  componentWillReceiveProps(nextProps) {
    this.toggle(!!nextProps.searchActive)
  }

  toggle(open = !this.state.open) {
    this.setState({ open })
  }

  render() {

    const { headerTitle, items } = this.props

    return (
      <li>
        <ul className="scrollable-menu">
          <li>
            <a className="name-container" onClick={() => this.toggle()}><h4>{headerTitle}</h4></a>
          </li>
          {this.state.open && items}
        </ul>
      </li>
    )
  }
}

Accordion.displayName = 'Accordion'
export default Accordion
