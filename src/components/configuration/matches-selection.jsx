import React from 'react'
import { Modal } from 'react-bootstrap'

class MatchesSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setMatchField = this.setMatchField.bind(this)
  }
  setMatchField(field) {
    return e => {
      e.preventDefault()
      this.props.changeValue(this.props.path.concat(['field']), field)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Choose Condition</h1>
          <p>Select the condition type. You can have multiple conditions of the same type in a policy.</p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            <li>
              <a href="#" onClick={this.setMatchField('request_host')}>
                Hostname
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_path')}>
                Directory Path
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField(null)}>
                MIME Type NEEDS_API
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField(null)}>
                File Extension NEEDS_API
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField(null)}>
                File Name NEEDS_API
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField(null)}>
                File Type NEEDS_API
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_query')}>
                Query String
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_header')}>
                Header
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_cookie')}>
                Cookie
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField(null)}>
                IP Address NEEDS_API
              </a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

MatchesSelection.displayName = 'MatchesSelection'
MatchesSelection.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array
}

module.exports = MatchesSelection
