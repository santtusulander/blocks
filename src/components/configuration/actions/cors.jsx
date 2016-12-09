import React from 'react'
import { Col, Input, Modal, Panel, Row } from 'react-bootstrap'
// import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Toggle from '../../toggle'
import Select from '../../select'
import InputConnector from '../../input-connector'

class Cors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'any_domain'
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
  handleSelectChange(path) {
    return value => {
      this.setState({
        activeFilter: value
      })
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
          <h1><FormattedMessage id="portal.policy.edit.cors.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.cors.corsForCss.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'cors_support_css']
                  )}/>
              </Col>
            </Row>
          </div>

          <hr />

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.cors.corsForJs.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'cors_support_js']
                  )}/>
              </Col>
            </Row>
          </div>

          <hr />

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.cors.corsForXml.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'cors_support_xml']
                  )}/>
              </Col>
            </Row>
          </div>

          <hr />

          <div className="form-group">
            <label className="control-label"><FormattedMessage id="portal.policy.edit.cors.supportdMethods.text"/></label>
          </div>

          <Input type="checkbox"
            id="actions_support_head"
            label="HEAD"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_support_head']
            )}/>

          <Input type="checkbox"
            id="actions_support_post"
            label="POST"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_support_post']
            )}/>

          <Input type="checkbox"
            id="actions_support_get"
            label="GET"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_support_get']
            )}/>

          <hr />

          <div className="form-group">
            <label className="control-label"><FormattedMessage id="portal.policy.edit.cors.httpHeaderMatches.text"/></label>
          </div>

          <Input type="checkbox"
            id="actions_header_matches_accept"
            label="Accept"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_match_accept']
            )}/>

          <Input type="checkbox"
            id="actions_header_matches_accept-language"
            label="Accept-Language"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_match_accept_language']
            )}/>

          <Input type="checkbox"
            id="actions_header_matches_content-language"
            label="Content-Language"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_match_content_language']
            )}/>

          <Input type="checkbox"
            id="actions_header_matches_last-event-id"
            label="Last-Event-ID"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_match_last_event_id']
            )}/>

          <hr />

          <div className="form-group">
            <label className="control-label">Content-Type</label>
          </div>

          <Input type="checkbox"
            id="actions_content_type_www-form"
            label="application/x-www-form-urlencoded"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_www_form']
            )}/>

          <Input type="checkbox"
            id="actions_content_type_multipart"
            label="multipart/form-data"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_multipart']
            )}/>

          <Input type="checkbox"
            id="actions_content_type_plain"
            label="text/plain"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_plain']
            )}/>

          <hr />

          <div className="form-groups">
            <InputConnector
              show={this.state.activeFilter === 'restrict_domain'} />
            <div className="form-group">
              <label className="control-label"><FormattedMessage id="portal.policy.edit.cors.authorizedDomains.text"/></label>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cors_authorized_domains']
                )}
                value={this.state.activeFilter}
                options={[
                  ['any_domain', <FormattedMessage id="portal.policy.edit.cors.anyDomain.text"/>],
                  ['restrict_domain', <FormattedMessage id="portal.policy.edit.cors.restrictDomain.text"/>]]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeFilter === 'restrict_domain'}>
              <Input type="text"
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.cors.enterDomain.text'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cors_restrict_domain']
                )}/>
            </Panel>
          </div>

          <hr />

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.cors.overwriteOriginCorsHeaders.text"/> </label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'cors_overwrite_origin_headers']
                  )}/>
              </Col>
            </Row>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

Cors.displayName = 'Cors'
Cors.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired
  // path: React.PropTypes.instanceOf(Immutable.List),
  // set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(Cors)
