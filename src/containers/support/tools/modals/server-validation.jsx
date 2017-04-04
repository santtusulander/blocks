import React from 'react'
import {
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Table
} from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SupportToolModal from './support-tool-modal'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import IconServerValidation from '../../../../components/shared/icons/icon-server-validation'
import IconServerError from '../../../../components/shared/icons/icon-server-error'

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
    const {handleCloseModal, showDetails, toggleShowDetails} = this.props
    const randomNumber = Math.floor(Math.random() * 2.9)
    const validationMessage = randomNumber === 0 ?
      (<tr>
        <td className="no-border" width="1%">
          <IconServerError
            className="three-tone pale-blue secondary-red"
            width={100} height={100} />
        </td>
        <td>
          <h2>123.123.123.12</h2>
          <h3><FormattedMessage id="portal.support.tools.serverValidation.modal.notUdnServer.text"/></h3>
        </td>
      </tr>)
    : randomNumber === 1 ?
      <tr>
        <td className="no-border" width="1%">
          <IconServerValidation
            className="three-tone pale-blue secondary-yellow"
            width={100} height={100} />
        </td>
        <td>
          <h2>123.123.123.12</h2>
          <h3><FormattedMessage id="portal.support.tools.serverValidation.modal.udnPartnerServer.text"/></h3>
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
          <h3><FormattedMessage id="portal.support.tools.serverValidation.modal.udnServer.text"/></h3>
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
            <h1><FormattedMessage id="portal.support.tools.serverValidation.modal.title.text"/></h1>
            <p><FormattedMessage id="portal.support.tools.serverValidation.modal.subTitle.text"/></p>
          </div>
        }>
        <div>
          <FormGroup>
            <ControlLabel><FormattedMessage id="portal.support.tools.serverValidation.modal.ipAddressLabel.text" /></ControlLabel>
            <FormControl
              placeholder={this.props.intl.formatMessage({ id: 'portal.support.tools.serverValidation.modal.ipAddressPlaceholder.text' })}
              value="123.123.123.12"
              onChange={() => null} />
          </FormGroup>

          <hr />

          <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>
            <FormattedMessage id="portal.button.VALIDATE"/>
          </Button>
          {showDetails && content}
        </div>
      </SupportToolModal>
    )
  }
}

ModalServerValidation.displayName = 'ModalServerValidation'
ModalServerValidation.propTypes = {
  handleCloseModal: React.PropTypes.func,
  intl: React.PropTypes.object,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default injectIntl(ModalServerValidation);
