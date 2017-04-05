import React from 'react'
import { Col, ControlLabel, FormControl, FormGroup, Modal, Row } from 'react-bootstrap'

import Toggle from '../../shared/form-elements/toggle'
import Select from '../../shared/form-elements/select'

import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

class Redirection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProtocol: 'http',
      activeRedirectionType: '301'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeProtocol') {
        this.setState({
          activeProtocol: value
        })
      } else if (key === 'activeRedirectionType') {
        this.setState({
          activeRedirectionType: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  handleToggleChange(path) {
    return value => {
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.redirection.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <ControlLabel><FormattedMessage id="portal.policy.edit.redirection.changeProtocol.text"/></ControlLabel>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_protocol']
                  )}/>
              </Col>
            </Row>
          </FormGroup>

          <Select className="input-select"
            onSelect={this.handleSelectChange('activeProtocol',
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_protocol']
            )}
            value={this.state.activeProtocol}
            options={[
              ['http', 'HTTP'],
              ['https', 'HTTPS']]}/>

          <hr />

          <FormGroup>
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.redirection.changeDomain.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_domain']
                  )}/>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="actions_domain">
            <FormControl
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.redirection.enterDomain.text'})}
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'redirection_domain']
              )}/>
          </FormGroup>

          <hr />

          <FormGroup>
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.redirection.changePath.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_path']
                  )}/>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup controlId="actions_path">
            <FormControl
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.redirection.enterPath.text'})}
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'redirection_path']
              )}/>
          </FormGroup>

          <hr />

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.redirection.redirectionType.text"/>
            </ControlLabel>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeRedirectionType',
                ['edge_configuration', 'cache_rule', 'actions', 'redirection_type']
              )}
              value={this.state.activeRedirectionType}
              options={[
                ['301', <FormattedMessage id="portal.policy.edit.redirection.301.text"/>],
                ['302', <FormattedMessage id="portal.policy.edit.redirection.302.text"/>],
                ['307', <FormattedMessage id="portal.policy.edit.redirection.307.text"/>],
                ['410', <FormattedMessage id="portal.policy.edit.redirection.410.text"/>],
                ['418', <FormattedMessage id="portal.policy.edit.redirection.418.text"/>]]}/>
          </FormGroup>

        </Modal.Body>
      </div>
    )
  }
}

Redirection.displayName = 'Redirection'
Redirection.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired
}

module.exports = injectIntl(Redirection)
