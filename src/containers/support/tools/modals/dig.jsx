import React from 'react'
import {
  Button,
  Col,
  Row,
  FormGroup,
  ControlLabel,
  FormControl,
  Radio,
  Table,
  Well
} from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SupportToolModal from './support-tool-modal'
import SelectWrapper from '../../../../components/select-wrapper'
import LoadingSpinner from '../../../../components/loading-spinner/loading-spinner'

import IconArrowXlDown from '../../../../components/shared/icons/icon-arrow-xl-down'

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
          <ControlLabel><FormattedMessage id="portal.support.tools.dig.modal.domainNameLabel.text" /></ControlLabel>
          <FormControl
            placeholder={this.props.intl.formatMessage({ id: 'portal.support.tools.dig.modal.domainNamePlaceholder.text' })}
            value="www.modernfamily.com"
            onChange={() => null}/>
        </FormGroup>

        <hr/>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.support.tools.dig.modal.testFromTitle.text"/></ControlLabel>

          <Radio
            name="radioGroup1"
            checked={true}
            onChange={() => null}
          ><FormattedMessage id="portal.support.tools.dig.modal.nameServerPredefined.text" /></Radio>

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
          ><FormattedMessage id="portal.support.tools.dig.modal.nameServerOwn.text" /></Radio>
        </FormGroup>

        <hr/>
        <Button bsStyle="primary" onClick={() => toggleShowDetails(true)}>
          <FormattedMessage id="portal.button.SUBMIT"/>
        </Button>
      </div>
    )
    const content = (
      <div>
        <h4><FormattedMessage id="portal.support.tools.dig.modal.queryTitle.text"/></h4>
        <Well className="tool-panel-selected-box">
          <Row>
            <Col xs={8}>
              <p><FormattedMessage id="portal.support.tools.dig.modal.queryUrlFrom.text"
                                   values={{ url: <b>www.modernfamily.com</b>, nameServer: <b>New York</b> }}/>
              </p>
            </Col>
            <Col xs={4}>
              <Button className="pull-right" bsStyle="link" onClick={() => toggleShowDetails(false)}>
                <FormattedMessage id="portal.button.EDIT"/>
              </Button>
            </Col>
          </Row>
        </Well>

        {this.state.showLoading ?
          <LoadingSpinner />
          :
          <div>
            <hr/>

            <h4><FormattedMessage id="portal.support.tools.dig.modal.requestSectionTitle.text"/></h4>
            <Table striped={true}>
              <thead>
              <tr>
                <th width="50%"><FormattedMessage id="portal.support.tools.dig.modal.dnsServer.text"/></th>
                <th>208.67.222.222</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.queryType.text"/></td>
                <td>A</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.queryTitle.text"/></td>
                <td>www.modernfamily.com</td>
              </tr>
              </tbody>
            </Table>

            <hr />

            <h4><FormattedMessage id="portal.support.tools.dig.modal.questionSectionTitle.text"/></h4>
            <Table striped={true}>
              <thead>
              <tr>
                <th><FormattedMessage id="portal.support.tools.dig.modal.name.text"/></th>
                <th width="40%">www.modernfamily.com</th>
                <th width="40%">www.modernfamily.com</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.type.text"/></td>
                <td>1</td>
                <td>A</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.class.text"/></td>
                <td>1</td>
                <td>IN</td>
              </tr>
              </tbody>
            </Table>

            <hr />

            <h4><FormattedMessage id="portal.support.tools.dig.modal.answerSectionTitle.text"/></h4>
            <p><FormattedMessage id="portal.support.tools.dig.modal.answerSectionSubtitle.text"
                                 values={{ current: 1, total: 3 }}/></p>
            <Table striped={true}>
              <thead>
              <tr>
                <th><FormattedMessage id="portal.support.tools.dig.modal.name.text"/></th>
                <th width="40%">www.modernfamily.com</th>
                <th width="40%">www.modernfamily.com</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.type.text"/></td>
                <td>5</td>
                <td>CNAME</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.class.text"/></td>
                <td>1</td>
                <td>IN</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.ttl.text"/></td>
                <td>86400</td>
                <td>1d 0h 0m 0s</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RDLength.text"/></td>
                <td>33</td>
                <td>31</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RData.text"/></td>
                <td>77 69 6C 64 65 74</td>
                <td>*.modernfamily.edge.com</td>
              </tr>
              </tbody>
            </Table>

            <div className="text-center"><IconArrowXlDown className="pale-blue"/></div>

            <p><FormattedMessage id="portal.support.tools.dig.modal.answerSectionSubtitle.text"
                                 values={{ current: 2, total: 3 }}/></p>
            <Table striped={true}>
              <thead>
              <tr>
                <th><FormattedMessage id="portal.support.tools.dig.modal.name.text"/></th>
                <th width="40%">*.modernfamily.edge.com</th>
                <th width="40%">*.modernfamily.edge.com</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.type.text"/></td>
                <td>5</td>
                <td>CNAME</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.class.text"/></td>
                <td>1</td>
                <td>IN</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.ttl.text"/></td>
                <td>86400</td>
                <td><FormattedMessage id="portal.support.tools.dig.modal.ttlValues.text"
                                      values={{ days: 1, hours: 0, minutes: 0, seconds: 0 }}/></td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RDLength.text"/></td>
                <td>33</td>
                <td>31</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RData.text"/></td>
                <td>77 69 6C 64 65 74</td>
                <td>gslb.pod1.cdx-test.com</td>
              </tr>
              </tbody>
            </Table>

            <div className="text-center"><IconArrowXlDown className="pale-blue"/></div>

            <p><FormattedMessage id="portal.support.tools.dig.modal.answerSectionSubtitle.text"
                                 values={{ current: 3, total: 3 }}/></p>
            <Table striped={true}>
              <thead>
              <tr>
                <th><FormattedMessage id="portal.support.tools.dig.modal.name.text"/></th>
                <th width="40%">gslb.pod1.cdx-test.com</th>
                <th width="40%">gslb.pod1.cdx-test.com</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.type.text"/></td>
                <td>1</td>
                <td>A</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.class.text"/></td>
                <td>1</td>
                <td>IN</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.ttl.text"/></td>
                <td>86400</td>
                <td><FormattedMessage id="portal.support.tools.dig.modal.ttlValues.text"
                                      values={{ days: 1, hours: 0, minutes: 0, seconds: 0 }}/></td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RDLength.text"/></td>
                <td>4</td>
                <td>4</td>
              </tr>
              <tr>
                <td><FormattedMessage id="portal.support.tools.dig.modal.RData.text"/></td>
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
            <h1><FormattedMessage id="portal.support.tools.dig.modal.title.text"/></h1>
            <p><FormattedMessage id="portal.support.tools.dig.modal.subTitle.text"/></p>
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
  intl: React.PropTypes.object,
  showDetails: React.PropTypes.bool,
  toggleShowDetails: React.PropTypes.func
}

export default injectIntl(ModalDig);
