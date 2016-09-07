import React from 'react'
import { Input, Panel, Row, Col } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

import {FormattedMessage, injectIntl} from 'react-intl'

class CacheKeyQueryStringForm extends React.Component {
  constructor(props) {
    super(props);

    const currentNames = props.set.get('name')
    let queryArgs = Immutable.List([''])
    let activeFilter = 'ignore_all_query_parameters'
    if(currentNames) {
      if(currentNames.find(name => name.get('field') === 'request_query')) {
        activeFilter = 'include_all_query_parameters'
      }
      else {
        const currentQueryArgs = currentNames
          .filter(name => name.get('field') === 'request_query_arg')
          .map(name => name.get('field_detail'))
        if(currentQueryArgs.size) {
          queryArgs = currentQueryArgs.push('')
          activeFilter = 'include_some_parameters'
        }
      }
    }

    this.state = {
      activeFilter: activeFilter,
      queryArgs: queryArgs
    }

    this.handleChangeArg = this.handleChangeArg.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.updateSet = this.updateSet.bind(this)
  }
  handleChangeArg(index) {
    return e => {
      let newArgs = this.state.queryArgs.set(index, e.target.value)
      if(newArgs.last()) {
        newArgs = newArgs.push('')
      }
      this.setState({queryArgs: newArgs}, this.updateSet)
    }
  }
  handleSelectChange(value) {
    this.setState({activeFilter: value}, this.updateSet)
  }
  updateSet() {
    let newName = [
      {field: 'request_host'},
      {field: 'request_path'}
    ]
    if(this.state.activeFilter === 'include_all_query_parameters') {
      newName.push({field: 'request_query'})
    }
    else if(this.state.activeFilter === 'include_some_parameters') {
      this.state.queryArgs.forEach(queryArg => {
        if(queryArg) {
          newName.push({
            field: 'request_query_arg',
            field_detail: queryArg
          })
        }
      })
    }
    const newSet = this.props.set.set('name', newName)
    this.props.updateSet(newSet)
  }
  render() {
    const {intl: {formatMessage}, horizontal} = this.props
    const hasContainingRule =
      this.state.activeFilter === 'include_some_parameters'
    const keySelect = (<Select className="input-select"
      onSelect={this.handleSelectChange}
      value={this.state.activeFilter}
      options={[
        ['include_all_query_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.includeAllQueryTerms.text"/>],
        ['ignore_all_query_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.ignoreAllQueryTerms.text"/>],
        ['include_some_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.includeSomeQueryTerms.text"/>]]}/>)
    const qNameInputs = this.state.queryArgs.map((queryArg, i) => <Input type="text"
      label={!horizontal && formatMessage({
        id: 'portal.policy.edit.cacheKeyQueryString.queryName.text'
      })} key={i}
      placeholder={formatMessage({
        id: 'portal.policy.edit.cacheKeyQueryString.enterQueryName.text'
      })}
      value={queryArg}
      onChange={this.handleChangeArg(i)}/>)
    if(horizontal) {
      return (<div>
        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage
              id='portal.policy.edit.cacheKeyQueryString.cacheKey.text'/>
          </Col>
          <Col lg={5} xs={6}>
            {keySelect}
          </Col>
        </Row>
        {hasContainingRule && qNameInputs.map((input, i) => <Row className="form-group" key={i}>
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage
              id='portal.policy.edit.cacheKeyQueryString.queryName.text'/>
          </Col>
          <Col lg={5} xs={6}>
            {input}
          </Col>
        </Row>)}
      </div>)
    }

    return (
      <div className="form-groups">
        <InputConnector show={hasContainingRule} />
        <div className="form-group">
          <label className="control-label">
            <FormattedMessage
              id='portal.policy.edit.cacheKeyQueryString.cacheKey.text'/>
          </label>
          {keySelect}
        </div>

        <Panel className="form-panel" collapsible={true}
          expanded={hasContainingRule}>
          {qNameInputs}
        </Panel>
      </div>
    )
  }
}

CacheKeyQueryStringForm.displayName = 'CacheKeyQueryStringForm'
CacheKeyQueryStringForm.propTypes = {
  horizontal: React.PropTypes.bool,
  intl: React.PropTypes.object,
  set: React.PropTypes.instanceOf(Immutable.Map),
  updateSet: React.PropTypes.func
}

module.exports = injectIntl(CacheKeyQueryStringForm)
