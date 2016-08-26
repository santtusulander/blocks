import React from 'react'
import { Button, Image, Input, Table } from 'react-bootstrap'

import SupportToolModal from './support-tool-modal'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import '../../../../assets/img/temp-support-tools-modals-geo-map.png'

class ModalGeoLookup extends React.Component {
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
    const content = (
      <div>
        {this.state.showLoading ?
          <LoadingSpinner />
        :
          <div>
            <hr/>
            <Image
              responsive={true}
              src="../../../../assets/img/temp-support-tools-modals-geo-map.png" />
            <hr/>

            <h4>Geographic</h4>
            <Table striped={true}>
              <thead>
                <tr>
                  <th width="50%">Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Country</td>
                  <td>US</td>
                </tr>
                <tr>
                  <td>State</td>
                  <td>MA</td>
                </tr>
                <tr>
                  <td>City</td>
                  <td>Boston</td>
                </tr>
                <tr>
                  <td>Area Code</td>
                  <td>617</td>
                </tr>
                <tr>
                  <td>Time Zone</td>
                  <td>GMT -5</td>
                </tr>
                <tr>
                  <td>Metro Code</td>
                  <td>506</td>
                </tr>
              </tbody>
            </Table>

            <h4>Network</h4>
            <Table striped={true}>
              <thead>
                <tr>
                  <th width="50%">Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Autonomous System Name</td>
                  <td>Level 3</td>
                </tr>
                <tr>
                  <td>Autonomous System Value</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Proxy Type</td>
                  <td>corporate</td>
                </tr>
                <tr>
                  <td>Proxy Description</td>
                  <td>vpn</td>
                </tr>
                <tr>
                  <td>Mobile Carrier</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Connection Type</td>
                  <td>wired</td>
                </tr>
                <tr>
                  <td>Connection Speed</td>
                  <td>t3</td>
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
            <h1>GEO Lookup</h1>
            <p>Lookup the network attributes associated with an IP address.</p>
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
          <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>LOOKUP</Button>
          {showDetails && content}
        </div>
      </SupportToolModal>
    )
  }
}

ModalGeoLookup.displayName = 'ModalGeoLookup'
ModalGeoLookup.propTypes = {
  handleCloseModal: React.PropTypes.func,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default ModalGeoLookup;
