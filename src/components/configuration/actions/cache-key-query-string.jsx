import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'

class CacheKeyQueryString extends React.Component {
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
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleChangeArg(index) {
    return e => {
      let newArgs = this.state.queryArgs.set(index, e.target.value)
      if(newArgs.last()) {
        newArgs = newArgs.push('')
      }
      this.setState({queryArgs: newArgs})
    }
  }
  handleSelectChange(value) {
    this.setState({activeFilter: value})
  }
  saveChanges() {
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
    this.props.changeValue(
      this.props.path,
      Immutable.fromJS({name: newName})
    )
    this.props.close()
  }
  render() {
    const hasContainingRule =
      this.state.activeFilter === 'include_some_parameters'
    return (
      <div>
        <Modal.Header>
          <h1>Cache Key - Query String</h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">
            <InputConnector show={hasContainingRule} />
            <div className="form-group">
              <label className="control-label">Cache Key</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange}
                value={this.state.activeFilter}
                options={[
                  ['include_all_query_parameters', <FormattedMessage id="portal.policy.edit.cacheKeyQueryString.includeAllQueryTerms.text"/>],
                  ['ignore_all_query_parameters', <FormattedMessage id="portal.policy.edit.cacheKeyQueryString.ignoreAllQueryTerms.text"/>],
                  ['include_some_parameters', <FormattedMessage id="portal.policy.edit.cacheKeyQueryString.includeSomeQueryTerms.text"/>]]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={hasContainingRule}>
              {this.state.queryArgs.map((queryArg, i) => {
                return (
                  <Input type="text" label="Query Name" key={i}
                    placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.cacheKeyQueryString.enterQueryName.text'})}
                    value={queryArg}
                    onChange={this.handleChangeArg(i)}/>
                )
              })}
            </Panel>
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

CacheKeyQueryString.displayName = 'CacheKeyQueryString'
CacheKeyQueryString.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(CacheKeyQueryString)
