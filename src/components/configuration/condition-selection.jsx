import React from 'react'
import { Modal } from 'react-bootstrap'

class ChooseConditions extends React.Component {
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Choose Conditions</h1>
          <p>Select the condition type. You can have multiple conditions of the same type in a policy.</p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            <li>
              <a href="#">Hostname</a>
            </li>
            <li>
              <a href="#">Directory Path</a>
            </li>
            <li>
              <a href="#">MIME Type</a>
            </li>
            <li>
              <a href="#">File Extension</a>
            </li>
            <li>
              <a href="#">File Name</a>
            </li>
            <li>
              <a href="#">File Type</a>
            </li>
            <li>
              <a href="#">Query String</a>
            </li>
            <li>
              <a href="#">Header</a>
            </li>
            <li>
              <a href="#">Cookie</a>
            </li>
            <li>
              <a href="#">IP Address</a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

ChooseConditions.displayName = 'ChooseConditions'
ChooseConditions.propTypes = {
}

module.exports = ChooseConditions
