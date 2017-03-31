import React from 'react'
import { ControlLabel, Col, FormControl, FormGroup, Panel, Row } from 'react-bootstrap'
import Immutable, { Map, List, fromJS } from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

import {FormattedMessage, injectIntl} from 'react-intl'

class CacheKeyQueryStringForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: '',
      queryArgs: List()
    }

    this.handleChangeArg = this.handleChangeArg.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.updateSet = this.updateSet.bind(this)
  }

  componentWillMount() {
    this.updateState(this.props.set.get('name'))
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.set.get('name'), nextProps.set.get('name'))) {
      this.updateState(nextProps.set.get('name'))
    }
  }

  handleChangeArg(index) {
    return e => {
      let newArgs = this.state.queryArgs.set(index, e.target.value)

      if (newArgs.last()) {
        newArgs = newArgs.push('')
      }
      this.setState({queryArgs: newArgs}, this.updateSet)
    }
  }

  handleSelectChange(value) {
    this.setState({activeFilter: value}, this.updateSet)
  }

  updateState(currentNames) {
    let queryArgs = List()
    let activeFilter = 'ignore_all_query_parameters'

    if (currentNames) {
      if (currentNames.find(name => name.get('field') === 'request_query')) {
        activeFilter = 'include_all_query_parameters'
      }
      else {
        const currentQueryArgs = currentNames
          .filter(name => name.get('field') === 'request_query_arg')
          .map(name => name.get('field_detail'))

        if (currentQueryArgs.size) {
          queryArgs = currentQueryArgs

          if (currentQueryArgs.last() !== '') {
            queryArgs = queryArgs.push('')
          }

          activeFilter = 'include_some_parameters'
        }
      }
    }

    this.setState({
      activeFilter: activeFilter,
      queryArgs: queryArgs
    })
  }

  updateSet() {
    let newName = fromJS([
      {field: 'request_host'},
      {field: 'request_path'}
    ])

    if (this.state.activeFilter === 'include_all_query_parameters') {
      newName = newName.push(Map({field: 'request_query'}))
    }
    else if (this.state.activeFilter === 'include_some_parameters') {
      if (!this.state.queryArgs.size) {
        newName = newName.push(Map({
          field: 'request_query_arg',
          field_detail: ''
        }))
      }

      this.state.queryArgs.forEach(queryArg => {
        if (queryArg) {
          newName = newName.push(Map({
            field: 'request_query_arg',
            field_detail: queryArg
          }))
        }
      })
    }

    const newSet = this.props.set.set('name', newName)

    this.props.updateSet(newSet)
  }
  render() {
    const {intl: {formatMessage}, horizontal, disabled} = this.props
    const hasContainingRule =
      this.state.activeFilter === 'include_some_parameters'
    const keySelect = (<Select className="input-select"
      disabled={disabled}
      onSelect={this.handleSelectChange}
      value={this.state.activeFilter}
      options={[
        ['include_all_query_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.includeAllQueryTerms.text"/>],
        ['ignore_all_query_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.ignoreAllQueryTerms.text"/>],
        ['include_some_parameters', <FormattedMessage
          id="portal.policy.edit.cacheKeyQueryString.includeSomeQueryTerms.text"/>]]}/>)
    const qNameInputs = this.state.queryArgs.map((queryArg, i) =>
      <FormGroup key={`query-arg-${i}`}>
        <ControlLabel>
          {!horizontal && formatMessage({ id: 'portal.policy.edit.cacheKeyQueryString.queryName.text' })}
        </ControlLabel>
        <FormControl
          disabled={disabled}
          placeholder={formatMessage({ id: 'portal.policy.edit.cacheKeyQueryString.enterQueryName.text' })}
          value={queryArg}
          onChange={this.handleChangeArg(i)}/>
      </FormGroup>
    )
    if (horizontal) {
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
        <FormGroup>
          <ControlLabel>
            <FormattedMessage
              id='portal.policy.edit.cacheKeyQueryString.cacheKey.text'/>
          </ControlLabel>
          {keySelect}
        </FormGroup>

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
  disabled: React.PropTypes.bool,
  horizontal: React.PropTypes.bool,
  intl: React.PropTypes.object,
  set: React.PropTypes.instanceOf(Map),
  updateSet: React.PropTypes.func
}

export default injectIntl(CacheKeyQueryStringForm)
