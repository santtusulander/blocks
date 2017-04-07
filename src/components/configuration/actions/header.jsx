import React from 'react'
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal, Panel, Row } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import Select from '../../shared/form-elements/select'
import InputConnector from '../../shared/page-elements/input-connector'

class Header extends React.Component {
  constructor(props) {
    super(props);

    const value = props.set.get('value')

    this.state = {
      activeActivity: props.set.get('action') || 'set',
      from_header: '',
      from_value: '',
      to_header: props.set.get('header') || '',
      to_value: value && value.size ? value.get(0).get('field_detail') : ''
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.validate = this.validate.bind(this)
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
      }
    }
  }

  validate() {

    const {
      activeActivity,
      to_header,
      to_value,
      from_header,
      from_value
    } = this.state

    switch (activeActivity) {
      case 'set':
        return !!to_header && !!to_value
      case 'unset':
        return !!to_header
      case 'modify':
        return to_header && !!to_value && !!from_header && !!from_value
      default:
        return false
    }
  }

  saveChanges() {
    let newSet
    if (this.state.activeActivity === 'unset') {
      newSet = this.props.set.merge({
        action: "unset",
        header: this.state.to_header
      })
      // If there was perviously a value, be sure to delete it
      if (newSet.has('value')) {
        newSet = newSet.delete('value')
      }
    } else if (this.state.activeActivity === 'set') {
      newSet = this.props.set.merge({
        action: "set",
        header: this.state.to_header,
        value: Immutable.fromJS([{
          field: "text",
          field_detail: this.state.to_value
        }])
      })
    }
    this.props.saveAction(this.props.path, this.props.setKey, newSet)
  }
  render() {

    const {
      activeActivity,
      to_header,
      to_value,
      from_header,
      from_value
    } = this.state

    const isValid = this.validate()

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.header.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">

            <InputConnector show={true}
              hasTwoEnds={activeActivity !== 'unset'}/>

            <FormGroup>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.path.activity.text"/>
              </ControlLabel>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity')}
                value={activeActivity}
                options={[
                  ['set', <FormattedMessage id="portal.policy.edit.header.add.text"/>],
                  /*['modify', 'Modify'],*/
                  ['unset', <FormattedMessage id="portal.policy.edit.header.remove.text"/>]]}/>
            </FormGroup>

            <Panel className="form-panel" collapsible={true}
              expanded={activeActivity !== 'modify'}>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.header.name.label"/>
                </ControlLabel>
                <FormControl
                  placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.name.placeholder'})}
                  value={to_header}
                  onChange={(e) => {
                    this.setState({
                      to_header: e.target.value
                    })
                  }}/>
              </FormGroup>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={activeActivity === 'set'}>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.header.value.label"/>
                </ControlLabel>
                <FormControl
                  placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.value.placeholder'})}
                  value={to_value}
                  onChange={(e) => {
                    this.setState({
                      to_value: e.target.value
                    })
                  }}/>
              </FormGroup>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={activeActivity === 'modify'}>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>
                      <FormattedMessage id="portal.policy.edit.header.from.label"/>
                    </ControlLabel>
                    <FormControl
                      placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.from.placeholder'})}
                      value={from_header}
                      onChange={(e) => {
                        this.setState({
                          from_header: e.target.value
                        })
                      }}/>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>
                      <FormattedMessage id="portal.policy.edit.header.to.label"/>
                    </ControlLabel>
                    <FormControl
                      placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.to.placeholder'})}
                      value={to_header}
                      onChange={(e) => {
                        this.setState({
                          to_header: e.target.value
                        })
                      }}/>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>
                      <FormattedMessage id="portal.policy.edit.header.fromValue.label"/>
                    </ControlLabel>
                    <FormControl
                      placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.fromValue.placeholder'})}
                      value={from_value}
                      onChange={(e) => {
                        this.setState({
                          from_value: e.target.value
                        })
                      }}/>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <ControlLabel>
                      <FormattedMessage id="portal.policy.edit.header.toValue.label"/>
                    </ControlLabel>
                    <FormControl
                      placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.header.toValue.placeholder'})}
                      value={to_value}
                      onChange={(e) => {
                        this.setState({
                          to_value: e.target.value
                        })
                      }}/>
                  </FormGroup>
                </Col>
              </Row>
            </Panel>

          </div>

          <FormFooterButtons>
            <Button className="btn-secondary" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges} disabled={!isValid}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </FormFooterButtons>

        </Modal.Body>
      </div>
    )
  }
}

Header.displayName = 'Header'
Header.propTypes = {
  close: React.PropTypes.func,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  saveAction: React.PropTypes.func,
  set: React.PropTypes.instanceOf(Immutable.Map),
  setKey: React.PropTypes.string
}

export default injectIntl(Header)
