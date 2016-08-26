import React from 'react'
import { Button, Col, Input, Row, Table, Well } from 'react-bootstrap'

import SupportToolModal from './support-tool-modal'
import SelectWrapper from '../../../../components/select-wrapper'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import IconArrowXlDown from '../../../../components/icons/icon-arrow-xl-down'

class ModalDig extends React.Component {
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
        <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>SUBMIT</Button>
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
              <Button className="pull-right" bsStyle="link" onClick={() => toggleShowDetails(false)}>EDIT</Button>
            </Col>
          </Row>
        </Well>

        {this.state.showLoading ?
          <LoadingSpinner />
        :
          <div>
            <hr/>

            <h4>Request Section</h4>
            <Table striped={true}>
              <thead>
                <tr>
                  <th width="50%">DNS Server</th>
                  <th>208.67.222.222</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Query Type</td>
                  <td>A</td>
                </tr>
                <tr>
                  <td>Query</td>
                  <td>www.modernfamily.com</td>
                </tr>
              </tbody>
            </Table>

            <hr />

            <h4>Question Section</h4>
            <Table striped={true}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th width="40%">www.modernfamily.com</th>
                  <th width="40%">www.modernfamily.com</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>1</td>
                  <td>A</td>
                </tr>
                <tr>
                  <td>Class</td>
                  <td>1</td>
                  <td>IN</td>
                </tr>
              </tbody>
            </Table>

            <hr />

            <h4>Answer Section</h4>
            <p>Answer 1 of 3</p>
            <Table striped={true}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th width="40%">www.modernfamily.com</th>
                  <th width="40%">www.modernfamily.com</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>5</td>
                  <td>CNAME</td>
                </tr>
                <tr>
                  <td>Class</td>
                  <td>1</td>
                  <td>IN</td>
                </tr>
                <tr>
                  <td>TTL</td>
                  <td>86400</td>
                  <td>1d 0h 0m 0s</td>
                </tr>
                <tr>
                  <td>RDLength</td>
                  <td>33</td>
                  <td>31</td>
                </tr>
                <tr>
                  <td>RData</td>
                  <td>77 69 6C 64 65 74</td>
                  <td>*.modernfamily.edge.com</td>
                </tr>
              </tbody>
            </Table>

            <div className="text-center"><IconArrowXlDown className="pale-blue" /></div>

            <p>Answer 2 of 3</p>
            <Table striped={true}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th width="40%">*.modernfamily.edge.com</th>
                  <th width="40%">*.modernfamily.edge.com</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>5</td>
                  <td>CNAME</td>
                </tr>
                <tr>
                  <td>Class</td>
                  <td>1</td>
                  <td>IN</td>
                </tr>
                <tr>
                  <td>TTL</td>
                  <td>86400</td>
                  <td>1d 0h 0m 0s</td>
                </tr>
                <tr>
                  <td>RDLength</td>
                  <td>33</td>
                  <td>31</td>
                </tr>
                <tr>
                  <td>RData</td>
                  <td>77 69 6C 64 65 74</td>
                  <td>gslb.pod1.cdx-test.com</td>
                </tr>
              </tbody>
            </Table>

            <div className="text-center"><IconArrowXlDown className="pale-blue" /></div>

            <p>Answer 3 of 3</p>
            <Table striped={true}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th width="40%">gslb.pod1.cdx-test.com</th>
                  <th width="40%">gslb.pod1.cdx-test.com</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>1</td>
                  <td>A</td>
                </tr>
                <tr>
                  <td>Class</td>
                  <td>1</td>
                  <td>IN</td>
                </tr>
                <tr>
                  <td>TTL</td>
                  <td>86400</td>
                  <td>1d 0h 0m 0s</td>
                </tr>
                <tr>
                  <td>RDLength</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>RData</td>
                  <td>60 06 32 9A</td>
                  <td>96.6.50.154</td>
                </tr>
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
            <h1>DIG</h1>
            <p>Query nameserver answer for a given host.</p>
          </div>
        }>
        {showDetails ? content : form}
      </SupportToolModal>
    )
  }
}

ModalDig.displayName = 'ModalDig'
ModalDig.propTypes = {
  handleCloseModal: React.PropTypes.func,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default ModalDig;
