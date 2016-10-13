import React from 'react'
import { Button, ButtonToolbar, Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'
import { secondsToUnit, secondsFromUnit } from '../helpers'

class Cache extends React.Component {
  constructor(props) {
    super(props)
    let maxAge = props.set.get('max_age')

    if (!maxAge) {
      maxAge = secondsFromUnit(7, 'days')
    } else {
      maxAge = Number(maxAge)
    }

    let ttlType = 'seconds'
    if (maxAge / 86400 >= 1) {
      maxAge = secondsToUnit(maxAge, 'days')
      ttlType = 'days'
    } else if (maxAge / 3600 >= 1) {
      maxAge = secondsToUnit(maxAge, 'hours')
      ttlType = 'hours'
    } else if (maxAge / 60 >= 1) {
      maxAge = secondsToUnit(maxAge, 'minutes')
      ttlType = 'minutes'
    }

    this.state = {
      checkEtag: props.set.get('check_etag') || 'false',
      honorOrigin: props.set.get('honor_origin'),
      maxAge: maxAge,
      noStore: props.set.get('no_store'),
      ttlType: ttlType
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleEtagChange = this.handleEtagChange.bind(this)
    this.handleTTLTypeChange = this.handleTTLTypeChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
    this.getMaxAge = this.getMaxAge.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleChange(key) {
    return e => {
      let stateObj = {}
      stateObj[key] = e.target.value
      this.setState(stateObj)
    }
  }
  handleEtagChange(value) {
    this.setState({checkEtag: value})
  }
  handleTTLTypeChange(value) {
    this.setState({ttlType: value})
  }
  handleToggleChange(key) {
    return value => {
      let stateObj = {}
      stateObj[key] = value
      this.setState(stateObj)
    }
  }
  getMaxAge() {
    let maxAge = Number(this.state.maxAge)

    switch (this.state.ttlType) {
      case 'minutes':
        maxAge = secondsFromUnit(maxAge, 'minutes')
        break
      case 'hours':
        maxAge = secondsFromUnit(maxAge, 'hours')
        break
      case 'days':
        maxAge = secondsFromUnit(maxAge, 'days')
        break
    }

    return maxAge;
  }
  saveChanges() {
    this.props.changeValue(
      this.props.path,
      this.props.set.merge({
        check_etag: this.state.checkEtag,
        max_age: this.getMaxAge(),
        no_store: this.state.noStore,
        honor_origin: this.state.honorOrigin
      })
    )
    this.props.close()
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.cache.cache.text"/></h1>
        </Modal.Header>
        <Modal.Body>

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label><FormattedMessage id="portal.policy.edit.cache.noStore.text"/></label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.state.noStore}
                changeValue={this.handleToggleChange('noStore')}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label><FormattedMessage id="portal.policy.edit.cache.honorCacheControl.text"/></label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.state.honorOrigin}
                changeValue={this.handleToggleChange('honorOrigin')}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label><FormattedMessage id="portal.policy.edit.cache.honorEtag.text"/></label>
            </Col>
            <Col xs={4}>
              <Select className="input-select small-select"
                onSelect={this.handleEtagChange}
                value={this.state.checkEtag}
                options={[
                  ['strong', <FormattedMessage id="portal.policy.edit.cache.honorEtagStrong.text"/>],
                  ['weak', <FormattedMessage id="portal.policy.edit.cache.honorEtagWeak.text"/>],
                  ['false', <FormattedMessage id="portal.policy.edit.cache.honorEtagFalse.text"/>]]}/>
            </Col>
          </Row>

          <hr />

          <Input label={this.props.intl.formatMessage({id: 'portal.policy.edit.cache.ttlValue.text'})}>
            <Row>
              <Col xs={6}>
                <Input type="number"
                  id="actions_ttl-value-number"
                  placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.cache.ttlValue.placeholder'})}
                  value={this.state.maxAge || 0}
                  onChange={this.handleChange('maxAge')}/>
              </Col>
              <Col xs={6}>
                <Select className="input-select"
                  onSelect={this.handleTTLTypeChange}
                  value={this.state.ttlType}
                  options={[
                    ['seconds', <FormattedMessage id="portal.policy.edit.cache.ttlValue.seconds"/>],
                    ['minutes', <FormattedMessage id="portal.policy.edit.cache.ttlValue.minutes"/>],
                    ['hours', <FormattedMessage id="portal.policy.edit.cache.ttlValue.hours"/>],
                    ['days', <FormattedMessage id="portal.policy.edit.cache.ttlValue.days"/>]]}/>
              </Col>
            </Row>
          </Input>

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" onClick={this.props.close}>
              Cancel
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              Save Action
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

Cache.displayName = 'Cache'
Cache.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(Cache)
