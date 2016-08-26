import React from 'react'
import { Button, Input, Table } from 'react-bootstrap'

import SupportToolModal from './support-tool-modal'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import IconServerValidation from '../../../../components/icons/icon-server-validation'
import IconServerError from '../../../../components/icons/icon-server-error'

class ModalServerValidation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showLoading: false
    }

    this.loadingTimeout
  }
  componentWillReceiveProps(newProps) {
    clearTimeout(this.loadingTimeout)
    if(newProps.showDetails) {
      this.setState({
        showLoading: true
      })
      this.loadingTimeout = setTimeout(() => {
        this.setState({
          showLoading: false
        })
      }, 1000)
    }
  }
  render() {
    const {handleCloseModal, showDetails, toggleShowDetails} = this.props
    const randomNumber = Math.floor(Math.random() * 2.9)
    const validationMessage = randomNumber === 0 ?
      <tr>
        <td className="no-border" width="1%">
          <IconServerError
            className="three-tone pale-blue secondary-red"
            width={100} height={100} />
        </td>
        <td>
          <h2>123.123.123.12</h2>
          <h3>is NOT a UDN Server</h3>
        </td>
      </tr>
    : randomNumber === 1 ?
      <tr>
        <td className="no-border" width="1%">
          <IconServerValidation
            className="three-tone pale-blue secondary-yellow"
            width={100} height={100} />
        </td>
        <td>
          <h2>123.123.123.12</h2>
          <h3>is a UDN Partner Server</h3>
        </td>
      </tr>
    :
      <tr>
        <td className="no-border" width="1%">
          <IconServerValidation
            className="three-tone pale-blue secondary-green"
            width={100} height={100} />
        </td>
        <td>
          <h2>123.123.123.12</h2>
          <h3>is a UDN Server</h3>
        </td>
      </tr>
    const content = (
      <div>
        {this.state.showLoading ?
          <LoadingSpinner />
        :
          <div>
            <hr/>
            <Table>
              <tbody>
                {validationMessage}
              </tbody>
            </Table>
          </div>
        }
      </div>
    )
    return (
      <SupportToolModal
        handleCloseModal={handleCloseModal}
        showDetails={showDetails}
        header={
          <div>
            <h1>UDN Server Validation</h1>
            <p>Validate whether or not a particular IP address is from UDN network.</p>
          </div>
        }>
        <div>
          <Input
            type="text"
            placeholder="Enter IP Address"
            label="IP Address"
            value="123.123.123.12"
            onChange={() => null}/>
          <hr />
          <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>VALIDATE</Button>
          {showDetails && content}
        </div>
      </SupportToolModal>
    )
  }
}

ModalServerValidation.displayName = 'ModalServerValidation'
ModalServerValidation.propTypes = {
  handleCloseModal: React.PropTypes.func,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default ModalServerValidation;
