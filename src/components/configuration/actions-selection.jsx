import React from 'react'
import { Modal } from 'react-bootstrap'
import Immutable from 'immutable'

class ActionsSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setSetKey = this.setSetKey.bind(this)
  }
  setSetKey(key) {
    return e => {
      e.preventDefault()
      const parentPath = this.props.path.slice(0, -1)
      const currentVal = this.props.config.getIn(this.props.path)
      this.props.changeValue(parentPath, Immutable.Map().set(
        key,
        currentVal
      ))
      this.props.activateSet(parentPath.concat([key]))
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Choose Actions</h1>
          <p>Select the action type</p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            <li>
              <a href="#" onClick={this.setSetKey('cache_control')}>
                Cache
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('cache_name')}>
                Cache Key - Query String
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('header')}>
                Header
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Redirection
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Origin Hostname
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Compression
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Path
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Query String
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Remove Vary
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                Allow/Block
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                POST Support
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                CORS
              </a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

ActionsSelection.displayName = 'ActionsSelection'
ActionsSelection.propTypes = {
  activateSet: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = ActionsSelection
