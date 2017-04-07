import React from 'react'
import {
  Button,
  Image,
  FormGroup,
  ControlLabel,
  FormControl,
  Table
} from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SupportToolModal from './support-tool-modal'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import '../../../../assets/img/temp-support-tools-modals-geo-map.png'

/* TODO: uncomment once tab will be enabled */
/* eslint-disable react-intl/string-is-marked-for-translation */

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
    if (newProps.showDetails) {
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
    const { handleCloseModal, showDetails, toggleShowDetails } = this.props
    const content = (
      <div>
        {this.state.showLoading ?
          <LoadingSpinner />
          :
          <div>
            <hr/>
            <Image
              responsive={true}
              src="../../../../assets/img/temp-support-tools-modals-geo-map.png"/>
            <hr/>

            <h4><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.geographicSectionTitle.text"/></h4>
            <Table striped={true}>
              <thead>
              <tr>
                <th width="50%"><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.attribute.text"/></th>
                <th><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.value.text"/></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.country.text"/></td>
                <td>US</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.state.text"/></td>
                <td>MA</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.city.text"/></td>
                <td>Boston</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.areaCode.text"/></td>
                <td>617</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.timeZone.text"/></td>
                <td>GMT -5</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.metroCode.text"/></td>
                <td>506</td>
              </tr>
              </tbody>
            </Table>

            <h4><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.networkSectionTitle.text"/></h4>
            <Table striped={true}>
              <thead>
              <tr>
                <th width="50%"><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.attribute.text"/></th>
                <th><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.value.text"/></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.autonomousSystemName.text"/></td>
                <td>Level 3</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.autonomousSystemValue.text"/></td>
                <td>1</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.proxyType.text"/></td>
                <td>corporate</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.proxyDescription.text"/></td>
                <td>vpn</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.mobileCarrier.text"/></td>
                <td>-</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.connectionType.text"/></td>
                <td>wired</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.geoLookup.modal.connectionSpeed.text"/></td>
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
            <h1><FormattedMessage id="portal.support.tools.geoLookup.modal.title.text"/></h1>
            <p><FormattedMessage id="portal.support.tools.geoLookup.modal.subTitle.text"/></p>
          </div>
        }>
        <div>
          <FormGroup>
            <ControlLabel><FormattedMessage id="portal.support.tools.geoLookup.modal.ipAddressLabel.text" /></ControlLabel>
            <FormControl
              placeholder={this.props.intl.formatMessage({ id: 'portal.support.tools.geoLookup.modal.ipAddressPlaceholder.text' })}
              value="123.123.123.12"
              onChange={() => null}
            />
          </FormGroup>
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
  intl: React.PropTypes.object,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default injectIntl(ModalGeoLookup);
