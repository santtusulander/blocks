import React from 'react'
import {Button, Input, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

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

        <Row>
          <Col xs={10}>
            <Input type="select" id="configure__edge__add-cache-rule__rule-type"
              label="Rule Type" onChange={this.handleChange(['path'])}>
              <option value="1">Extension</option>
              <option value="2">Directory</option>
              <option value="3">File Type</option>
              <option value="4">MIME-Type</option>
            </Input>
          </Col>
        </Row>


        {/* Rule Value */}

        <Row>
          <Col xs={10}>
            <Input type="text" id="configure__edge__add-cache-rule__rule-value"
              label="Rule Value" placeholder="text/html"
              onChange={this.handleChange(['path'])}/>
          </Col>
        </Row>


        {/* Rule Match */}

        <Row>
          <Col xs={10}>
            <Input type="select"
              id="configure__edge__add-cache-rule__rule-match"
              onChange={this.handleChange(['path'])}>
              <option value="1">Matches</option>
              <option value="2">Doesn't Match</option>
            </Input>
          </Col>
        </Row>


        {/* No-Store */}

        <Row>
          <Col xs={10}>
            <Input type="checkbox"
              id="configure__edge__add-cache-rule__no-store"
              label="No-Store"
              onChange={this.handleChange(['path'])}/>
          </Col>
        </Row>


        {/* TTL Value */}

        <Row>
          <Col xs={10}>
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
          </Col>
        </Row>


        {/* Action buttons */}

        <ButtonToolbar className="text-center">
          <Button>Cancel</Button>
          <Button type="submit" bsStyle="primary">Add</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

ConfigurationCacheRuleEdit.displayName = 'ConfigurationCacheRuleEdit'
ConfigurationCacheRuleEdit.propTypes = {
  changeValue: React.PropTypes.func,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationCacheRuleEdit
