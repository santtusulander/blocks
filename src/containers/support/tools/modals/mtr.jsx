import React from 'react'
import { Button, ButtonToolbar, Col, Image, Input, Label,
  Modal, Row, Table, Well } from 'react-bootstrap'

import SelectWrapper from '../../../../components/select-wrapper'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import '../../../../assets/img/temp-support-tools-modals-mtr-map.png'

class ModalMtr extends React.Component {
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
      }, 1500)
    }
  }
  render() {
    const {handleCloseModal, showDetails, toggleShowDetails} = this.props
    const form = (
      <div>
        <Input
          type="text"
          placeholder="Enter Domain Name"
          label="Domain name"
          value="www.modernfamily.com"
          onChange={() => null}/>
        <hr/>
        <h4>Test from</h4>
        <Input
          type="radio"
          label="Use a pre-defined nameserver"
          name="radioGroup1"
          checked={true}
          onChange={() => null}/>
        <div className="form-group">
          <SelectWrapper
            id='d'
            value="ny"
            onChange={() => null}
            options={[{value: 'ny', label: 'US (New York)'}]}/>
        </div>
        <Input
          type="radio"
          label="Use your own nameserver"
          name="radioGroup1"
          onChange={() => null}/>
        <hr/>
        <Button bsStyle="primary" onClick={toggleShowDetails}>TEST</Button>
      </div>
    )
    const content = (
      <div>
        <h4>Query</h4>
        <Well className="tool-panel-selected-box">
          <Row>
            <Col xs={8}>
              <p><b>www.modernfamily.com</b><br />
              from <b>New York</b></p>
            </Col>
            <Col xs={4}>
              <Button className="pull-right" bsStyle="link" onClick={toggleShowDetails}>EDIT</Button>
            </Col>
          </Row>
        </Well>

        {this.state.showLoading ?
          <LoadingSpinner />
        :
          <div>
            <hr/>
            <Image
              responsive={true}
              src="../../../../assets/img/temp-support-tools-modals-mtr-map.png" />
            <hr/>
            <h4>Network Connectivity Test</h4>
            <p>From US (New York) 115.145.60.200 to modernfamily.com</p>

            <Table striped={true}>
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Loss %</th>
                  <th>Snt</th>
                  <th>Last</th>
                  <th>Avg</th>
                  <th>Best</th>
                  <th>Wrst</th>
                  <th>StDev</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>107.170.28.254</td>
                  <td><Label bsStyle="success">0 %</Label></td>
                  <td>10</td>
                  <td>0.8</td>
                  <td>0.8</td>
                  <td>0.6</td>
                  <td>1.5</td>
                  <td>0.0</td>
                </tr>
                <tr>
                  <td>198.199.99.237</td>
                  <td><Label bsStyle="warning">22 %</Label></td>
                  <td>4</td>
                  <td>0.4</td>
                  <td>0.7</td>
                  <td>0.4</td>
                  <td>1.4</td>
                  <td>0.0</td>
                </tr>
                <tr>
                  <td>156.254.5.135</td>
                  <td><Label bsStyle="danger">39 %</Label></td>
                  <td>4</td>
                  <td>1.5</td>
                  <td>1.5</td>
                  <td>1.4</td>
                  <td>1.5</td>
                  <td>0.0</td>
                </tr>
              </tbody>
            </Table>
          </div>
        }
      </div>
    )
    return (
      <Modal dialogClassName="account-form-sidebar configuration-sidebar" show={true}>
        <Modal.Header>
          <h1>MTR</h1>
          <p>Test network connectivity to determine packet loss.</p>
        </Modal.Header>

        <Modal.Body>
          {showDetails ? content : form}
          <ButtonToolbar className="text-right extra-margin-top">
            <Button bsStyle="primary" onClick={handleCloseModal}>Close</Button>
          </ButtonToolbar>
        </Modal.Body>
      </Modal>
    )
  }
}

ModalMtr.displayName = 'ModalMtr'
ModalMtr.propTypes = {
  handleCloseModal: React.PropTypes.func,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default ModalMtr;
