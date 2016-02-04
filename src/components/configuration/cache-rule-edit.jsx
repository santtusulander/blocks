import React from 'react'
import {Button, Input, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../select'

class ConfigurationCacheRuleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  render() {
    return (
      <form className="configuration-cache-rules" onSubmit={this.handleSave}>

        {/* Rule Type */}
        <Input label="Rule Type">
          <Select className="input-select"
            value="request_method"
            addonAfter=' '
            options={[
              ['request_method', 'Request Method'],
              ['request_scheme', 'Request Scheme'],
              ['request_url', 'Request URL'],
              ['request_host', 'Request Host'],
              ['request_path', 'Request Path'],
              ['request_query', 'Request Query'],
              ['request_query_arg', 'Request Query Argument'],
              ['request_header', 'Request Header'],
              ['request_cookie', 'Request Cookie'],
              ['response_code', 'Response Code'],
              ['response_header', 'Response Header']
            ]}/>
        </Input>


        {/* Rule Value */}

        <Input label="Rule Value">
          <Row>
            <Col xs={6}>
              <Input type="text" id="configure__edge__add-cache-rule__rule-value"
                placeholder="text/html"
                onChange={this.handleChange(['path'])}/>
            </Col>
            <Col xs={6}>
              <Input type="select"
                id="configure__edge__add-cache-rule__rule-match"
                onChange={this.handleChange(['path'])}>
                <option value="1">Matches</option>
                <option value="2">Doesn't Match</option>
              </Input>
            </Col>
          </Row>
        </Input>


        {/* No-Store */}
        <Input type="checkbox"
          id="configure__edge__add-cache-rule__no-store"
          label="No-Store"
          onChange={this.handleChange(['path'])}/>


        {/* TTL Value */}

        <Input label="TTL Value">
          <Row>
            <Col xs={6}>
              <Input type="number"
                id="configure__edge__add-cache-rule__ttl-value"
                placeholder="number"
                onChange={this.handleChange(['path'])}/>
            </Col>
            <Col xs={6}>
              <Input type="select"
                id="configure__edge__add-cache-rule__ttl-value-extension"
                onChange={this.handleChange(['path'])}>
                <option value="1">seconds</option>
                <option value="2">minutes</option>
                <option value="3">hours</option>
                <option value="4">days</option>
              </Input>
            </Col>
          </Row>
        </Input>


        {/* Action buttons */}

        <ButtonToolbar className="text-right">
          <Button bsStyle="primary" onClick={this.props.hideAction}>
            Cancel
          </Button>
          <Button type="submit" bsStyle="primary">
            Add
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

ConfigurationCacheRuleEdit.displayName = 'ConfigurationCacheRuleEdit'
ConfigurationCacheRuleEdit.propTypes = {
  changeActiveRuleType: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  hideAction: React.PropTypes.func,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  rulePath: React.PropTypes.array,
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationCacheRuleEdit
