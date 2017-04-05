import React from 'react'
import { Checkbox, Col, ControlLabel, FormControl, FormGroup, Modal, Panel, Row } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Toggle from '../../shared/form-elements/toggle'
import Select from '../../shared/form-elements/select'
import InputConnector from '../../shared/page-elements/input-connector'

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

          <FormGroup>
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
          </FormGroup>

          <hr />

          <FormGroup>
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
          </FormGroup>

          <hr />

          <FormGroup>
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
          </FormGroup>

          <hr />

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.cors.supportdMethods.text"/>
            </ControlLabel>

            <Checkbox
              id="actions_support_head"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_support_head']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.head.text" />
            </Checkbox>

            <Checkbox
              id="actions_support_post"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_support_post']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.post.text" />
            </Checkbox>

            <Checkbox
              id="actions_support_get"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_support_get']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.get.text" />
            </Checkbox>

          </FormGroup>

          <hr />

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.cors.httpHeaderMatches.text"/>
            </ControlLabel>

            <Checkbox
              id="actions_header_matches_accept"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_match_accept']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.accept.text" />
            </Checkbox>

            <Checkbox
              id="actions_header_matches_accept-language"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_match_accept_language']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.acceptLanguage.text" />
            </Checkbox>

            <Checkbox
              id="actions_header_matches_content-language"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_match_content_language']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.contentLanguage.text" />
            </Checkbox>

            <Checkbox
              id="actions_header_matches_last-event-id"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_match_last_event_id']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.lastEventID.text" />
            </Checkbox>

          </FormGroup>

          <hr />

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.cors.contentType.text" />
            </ControlLabel>

            <Checkbox
              id="actions_content_type_www-form"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_www_form']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.applicationXWwwFormUrlEncoded.text" />
            </Checkbox>

            <Checkbox
              id="actions_content_type_multipart"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_multipart']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.multipartFormData.text" />
            </Checkbox>

            <Checkbox
              id="actions_content_type_plain"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'cors_content_type_plain']
              )}>
              <FormattedMessage id="portal.policy.edit.cors.textPlain.text" />
            </Checkbox>

          </FormGroup>

          <hr />

          <div className="form-groups">
            <InputConnector
              show={this.state.activeFilter === 'restrict_domain'} />
            <FormGroup>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.cors.authorizedDomains.text"/>
              </ControlLabel>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cors_authorized_domains']
                )}
                value={this.state.activeFilter}
                options={[
                  ['any_domain', <FormattedMessage id="portal.policy.edit.cors.anyDomain.text"/>],
                  ['restrict_domain', <FormattedMessage id="portal.policy.edit.cors.restrictDomain.text"/>]]}/>
            </FormGroup>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeFilter === 'restrict_domain'}>
              <FormControl
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.cors.enterDomain.text'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cors_restrict_domain']
                )}/>
            </Panel>
          </div>

          <hr />

          <FormGroup>
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
          </FormGroup>

        </Modal.Body>
      </div>
    )
  }
}

Cors.displayName = 'Cors'
Cors.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired
}

module.exports = injectIntl(Cors)
