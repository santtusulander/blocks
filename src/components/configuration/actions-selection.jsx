import React from 'react'
import { Modal } from 'react-bootstrap'

class ActionsSelection extends React.Component {
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
              <a href="#">Cache</a>
            </li>
            <li>
              <a href="#">Cache Key - Query String</a>
            </li>
            <li>
              <a href="#">Redirection</a>
            </li>
            <li>
              <a href="#">Origin Hostname</a>
            </li>
            <li>
              <a href="#">Compression</a>
            </li>
            <li>
              <a href="#">Path</a>
            </li>
            <li>
              <a href="#">Query String</a>
            </li>
            <li>
              <a href="#">Header</a>
            </li>
            <li>
              <a href="#">Remove Vary</a>
            </li>
            <li>
              <a href="#">Allow/Block</a>
            </li>
            <li>
              <a href="#">POST Support</a>
            </li>
            <li>
              <a href="#">CORS</a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

ActionsSelection.displayName = 'ActionsSelection'
ActionsSelection.propTypes = {
}

module.exports = ActionsSelection
