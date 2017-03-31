import React, { PropTypes } from 'react';
import {Typeahead as BSTypeahead, AsyncTypeahead as AsyncBSTypeahead} from 'react-bootstrap-typeahead'

class Typeahead extends React.Component {
  constructor(props) {
    super(props)

    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleBlur(e) {
    if (this.props.onBlur) this.props.onBlur()
    e.target.removeEventListener('keydown', this.handleKeyDown)
  }

  handleFocus(e) {
    e.target.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e) {
    const label = e.target.value
    // 1. Ignore keys other than 13 (= ENTER)
    // 2. Add item only if new item value length >= minLength or 1
    if (e.keyCode === 13 && label.length >= (this.props.minLength || 1)) {
      // In case of duplicates we create unique ID's for the items
      const id = `label-${new Date().valueOf()}`

      // This is slightly dangerous approach as we are calling a private
      // function of React-Bootstrap-Typeahead component, but since they don't
      // offer public functions for adding new selections this is the only way.
      // Be cautious when updating this package as they might change the way
      // it's constructed and this might break as a result
      this.typeahead.getInstance()._handleAddOption({ id, label })
    }
  }

  render() {
    // Custom props adds listeners for ENTER key
    const customProps = this.props.allowNew ?
    {
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      ref: (ref) => {
        this.typeahead = ref
        return this.typeahead
      }
    } : {}

    const typeahead = this.props.asyncMode ? <AsyncBSTypeahead {...this.props} {...customProps} /> :
      <BSTypeahead {...this.props} {...customProps} />

    return typeahead
  }
}

Typeahead.displayName = 'Typeahead'
Typeahead.propTypes = {
  allowNew: PropTypes.bool,
  asyncMode: PropTypes.bool,
  minLength: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  onBlur: PropTypes.func
}

export default Typeahead
