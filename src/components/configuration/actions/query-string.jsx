import React from 'react'
import { Col, ControlLabel, FormControl, FormGroup, Modal, Panel, Row } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../shared/form-elements/select'
import InputConnector from '../../input-connector'

class QueryString extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeActivity: 'add',
      activeDirection: 'to_origin'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeActivity') {
        this.setState({
          activeActivity: value
        })
      } else if (key === 'activeDirection') {
        this.setState({
          activeDirection: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.queryString.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">

            <InputConnector show={true}
              hasTwoEnds={this.state.activeActivity !== 'remove'} />

            <FormGroup>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.path.activity.text" />
              </ControlLabel>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity',
                  ['edge_configuration', 'cache_rule', 'actions', 'query_string']
                )}
                value={this.state.activeActivity}
                options={[
                  ['add', <FormattedMessage id="portal.policy.edit.queryString.add.text"/>],
                  ['modify', <FormattedMessage id="portal.policy.edit.queryString.modify.text"/>],
                  ['remove', <FormattedMessage id="portal.policy.edit.queryString.remove.text"/>]]}/>
            </FormGroup>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity !== 'modify'}>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.queryString.name.text" />
              </ControlLabel>
              <FormControl
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.name.placeholder'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'query_string_name']
                )}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'add'}>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.queryString.value.text" />
              </ControlLabel>
              <FormControl
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.value.placeholder'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'query_string_value']
                )}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'modify'}>
              <Row>
                <Col xs={6}>
                  <ControlLabel>
                    <FormattedMessage id="portal.policy.edit.queryString.fromName.text" />
                  </ControlLabel>
                  <FormControl
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.fromName.placeholder'})}
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'query_string_name_from']
                    )}/>
                </Col>
                <Col xs={6}>
                  <ControlLabel>
                    <FormattedMessage id="portal.policy.edit.queryString.toName.text" />
                  </ControlLabel>
                  <FormControl
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.toName.placeholder'})}
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'query_string_name_to']
                    )}/>
                </Col>
                <Col xs={6}>
                  <ControlLabel>
                    <FormattedMessage id="portal.policy.edit.queryString.fromValue.text" />
                  </ControlLabel>
                  <FormControl
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.fromValue.placeholder'})}
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'query_string_value_from']
                    )}/>
                </Col>
                <Col xs={6}>
                  <ControlLabel>
                    <FormattedMessage id="portal.policy.edit.queryString.toValue.text" />
                  </ControlLabel>
                  <FormControl
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.queryString.toValue.placeholder'})}
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'query_string_value_to']
                    )}/>
                </Col>
              </Row>
            </Panel>

          </div>

        <hr />

        <div className="form-group">
          <ControlLabel>
            <FormattedMessage id="portal.policy.edit.queryString.direction.text"/>
          </ControlLabel>
          <Select className="input-select"
            onSelect={this.handleSelectChange('activeDirection',
              ['edge_configuration', 'cache_rule', 'actions', 'query_string_direction']
            )}
            value={this.state.activeDirection}
            options={[
              ['to_origin', <FormattedMessage id="portal.policy.edit.queryString.toOrigin.text"/>],
              ['to_client', <FormattedMessage id="portal.policy.edit.queryString.toClient.text"/>],
              ['to_both', <FormattedMessage id="portal.policy.edit.queryString.toBoth.text"/>]]}/>
        </div>

        </Modal.Body>
      </div>
    )
  }
}

QueryString.displayName = 'QueryString'
QueryString.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired
}

module.exports = injectIntl(QueryString)
