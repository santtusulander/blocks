import React from 'react'
import {
  Button,
  Col,
  Image,
  FormGroup,
  ControlLabel,
  FormControl,
  Label,
  Radio,
  Row,
  Table,
  Well
} from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SupportToolModal from './support-tool-modal'
import SelectWrapper from '../../../../components/shared/form-elements/select-wrapper'
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
    const form = (
      <div>
        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.support.tools.mtr.modal.domainNameLabel.text" /></ControlLabel>
          <FormControl
            placeholder={this.props.intl.formatMessage({ id: 'portal.support.tools.mtr.modal.domainNamePlaceholder.text' })}
            value="www.modernfamily.com"
            onChange={() => null}/>
        </FormGroup>

        <hr/>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.support.tools.mtr.modal.testFromSectionTitle.text" /></ControlLabel>

          <Radio
            name="radioGroup1"
            checked={true}
            onChange={() => null}
          ><FormattedMessage id="portal.support.tools.mtr.modal.nameserverPredefined.text" /></Radio>

          <div className="form-group">
            <SelectWrapper
              id='d'
              value="ny"
              onChange={() => null}
              options={[{ value: 'ny', label: 'US (New York)' }]}/>
          </div>

          <Radio
            name="radioGroup1"
            checked={true}
            onChange={() => null}
          ><FormattedMessage id="portal.support.tools.mtr.modal.nameserverOwn.text" /></Radio>
        </FormGroup>

        <hr/>

        <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>
          <FormattedMessage id="portal.button.TEST"/>
        </Button>
      </div>
    )
    const content = (
      <div>
        <h4><FormattedMessage id="portal.support.tools.mtr.modal.querySectionTitle.text"/></h4>
        <Well className="tool-panel-selected-box">
          <Row>
            <Col xs={8}>
              <p>
                <FormattedMessage id="portal.support.tools.mtr.modal.queryUrlFrom.text"
                                  values={{ url: 'www.modernfamily.com', nameServer: 'New York' }}/>
              </p>
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
            <Image
              responsive={true}
              src="/assets/img/temp-support-tools-modals-mtr-map.png"/>
            <hr/>
            <h4><FormattedMessage id="portal.support.tools.mtr.modal.networkSectionTitle.text"/></h4>
            <p><FormattedMessage id="portal.support.tools.mtr.modal.queryNameserverFrom.text"
                                 values={{
                                   nameServer: 'US (New York)',
                                   ip: '115.145.60.200',
                                   url: 'modernfamily.com'
                                 }}/></p>

            <Table striped={true}>
              <thead>
              <tr>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.host.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.loss.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.snt.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.last.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.avg.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.best.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.worst.text"/></th>
                <th><FormattedMessage id="portal.support.tools.mtr.modal.stDev.text"/></th>
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
      <SupportToolModal
        handleCloseModal={handleCloseModal}
        showDetails={showDetails}
        header={
          <div>
            <h1><FormattedMessage id="portal.support.tools.mtr.modal.title.text"/></h1>
            <p><FormattedMessage id="portal.support.tools.mtr.modal.subTitle.text"/></p>
          </div>
        }>
        {showDetails ? content : form}
      </SupportToolModal>
    )
  }
}

ModalMtr.displayName = 'ModalMtr'
ModalMtr.propTypes = {
  handleCloseModal: React.PropTypes.func,
  intl: React.PropTypes.object,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default injectIntl(ModalMtr);
