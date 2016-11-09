import React from 'react'
import { Button, ButtonToolbar, Col, Input, Modal, Panel, Row } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Header extends React.Component {
  constructor(props) {
    super(props);

    const value = props.set.get('value')

    this.state = {
      activeActivity: props.set.get('action') || 'set',
      activeDirection: 'to_origin',
      from_header: '',
      from_value: '',
      to_header: props.set.get('header'),
      to_value: value && value.size ? value.get(0).get('field_detail') : ''
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.set, this.props.set)) {
      const value = nextProps.set.get('value')

      this.state = {
        activeActivity: nextProps.set.get('action') || 'set',
        to_header: nextProps.set.get('header'),
        to_value: value && value.size ? value.get(0).get('field_detail') : ''
      }
    }
  }
  handleSelectChange(key) {
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
    }
  }
  saveChanges() {
    let newSet
    if(this.state.activeActivity === 'unset') {
      newSet = this.props.set.merge({
        action: "unset",
        header: this.state.to_header
      })
      // If there was perviously a value, be sure to delete it
      if(newSet.has('value')) {
        newSet = newSet.delete('value')
      }
    }
    else if(this.state.activeActivity === 'set') {
      newSet = this.props.set.merge({
        action: "set",
        header: this.state.to_header,
        value: Immutable.fromJS([{
          field: "text",
          field_detail: this.state.to_value
        }])
      })
    }
    this.props.changeValue(
      this.props.path,
      newSet
    )
    this.props.close()
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.header.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">

            <InputConnector show={true}
              hasTwoEnds={this.state.activeActivity !== 'unset'}/>

            <div className="form-group">
              <label className="control-label">Activity</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity')}
                value={this.state.activeActivity}
                options={[
                  ['set', <FormattedMessage id="portal.policy.edit.header.add.text"/>],
                  /*['modify', 'Modify'],*/
                  ['unset', <FormattedMessage id="portal.policy.edit.header.remove.text"/>]]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity !== 'modify'}>
              <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.name.label'})}
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.name.placeholder'})}
                value={this.state.to_header}
                onChange={(e) => {this.setState({
                  to_header: e.target.value
                })}}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'set'}>
              <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.value.label'})}
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.value.placeholder'})}
                value={this.state.to_value}
                onChange={(e) => {this.setState({
                  to_value: e.target.value
                })}}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'modify'}>
              <Row>
                <Col xs={6}>
                  <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.from.label'})}
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.from.placeholder'})}
                    value={this.state.from_header}
                    onChange={(e) => {this.setState({
                      from_header: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.to.label'})}
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.to.placeholder'})}
                    value={this.state.to_header}
                    onChange={(e) => {this.setState({
                      to_header: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.fromValue.label'})}
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.fromValue.placeholder'})}
                    value={this.state.from_value}
                    onChange={(e) => {this.setState({
                      from_value: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.header.toValue.label'})}
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.toValue.placeholder'})}
                    value={this.state.to_value}
                    onChange={(e) => {this.setState({
                      to_value: e.target.value
                    })}}/>
                </Col>
              </Row>
            </Panel>

          </div>

          <hr />

          <div className="form-group">
            <label className="control-label"><FormattedMessage id="portal.policy.edit.header.direction.text"/></label>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeDirection')}
              value={this.state.activeDirection}
              options={[
                ['to_origin', <FormattedMessage id="portal.policy.edit.header.toOrigin.text"/>],
                ['to_client', <FormattedMessage id="portal.policy.edit.header.toClient.text"/>],
                ['to_both', <FormattedMessage id="portal.policy.edit.header.toBoth.text"/>]]}/>
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

Header.displayName = 'Header'
Header.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(Header)
