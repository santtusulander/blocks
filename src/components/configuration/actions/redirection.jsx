import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

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

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.redirection.changeProtocol.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_protocol']
                  )}/>
              </Col>
            </Row>
          </div>

          <Select className="input-select"
            onSelect={this.handleSelectChange('activeProtocol',
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_protocol']
            )}
            value={this.state.activeProtocol}
            options={[
              ['http', 'HTTP'],
              ['https', 'HTTPS']]}/>

          <hr />

          <div className="form-group">
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
          </div>

          <Input type="text"
            id="actions_domain"
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.redirection.enterDomain.text'})}
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_domain']
            )}/>

          <hr />

          <div className="form-group">
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
          </div>

          <Input type="text"
            id="actions_path"
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.redirection.enterPath.text'})}
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_path']
            )}/>

          <hr />

          <div className="form-group">
            <label className="control-label"><FormattedMessage id="portal.policy.edit.redirection.redirectionType.text"/></label>
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
          </div>

        </Modal.Body>
      </div>
    )
  }
}

Redirection.displayName = 'Redirection'
Redirection.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(Redirection)
