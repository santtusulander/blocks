import React from 'react'
import { Panel, Button, Modal } from 'react-bootstrap'
import { Map, fromJS } from 'immutable'
import {FormattedMessage, injectIntl} from 'react-intl'

import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, arrayPush, arrayRemoveAll, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import InputConnector from '../../shared/page-elements/input-connector'
import { isValidTextField } from '../../../util/validators'

const MIN_FIELD_LENGTH = 1
const MAX_FIELD_LENGTH = 255

const queryStringFilterOptions = [
  ['include_all_query_parameters', <FormattedMessage
    id="portal.policy.edit.cacheKeyQueryString.includeAllQueryTerms.text"/>],
  ['ignore_all_query_parameters', <FormattedMessage
    id="portal.policy.edit.cacheKeyQueryString.ignoreAllQueryTerms.text"/>],
  ['include_some_parameters', <FormattedMessage
    id="portal.policy.edit.cacheKeyQueryString.includeSomeQueryTerms.text"/>]
]

const parseQueryArgs = (qNames) => {
  let queryArgs = []
  const currentQueryArgs = qNames
        .filter(name => name.get('field') === 'request_query_arg')
        .map(name => name.get('field_detail'))

  if (currentQueryArgs.size) {
    queryArgs = currentQueryArgs.toJS()

    if (currentQueryArgs.last() !== '') {
      queryArgs = queryArgs.concat([''])
    }
  }

  return queryArgs
}

const parseActiveFilter = (currentNames) => {
  let activeFilter = 'ignore_all_query_parameters'

  if (currentNames) {
    if (currentNames.find(name => name.get('field') === 'request_query')) {
      activeFilter = 'include_all_query_parameters'
    }

    if (currentNames.find(name => name.get('field') === 'request_query_arg')) {
      activeFilter = 'include_some_parameters'
    }
  }

  return activeFilter
}

const validate = ({ activeFilter, queryArgs }) => {
  const errors = {}

  errors.queryArgs = []

  if (activeFilter === 'include_some_parameters') {
    queryArgs.forEach((queryArg, i) => {
      if (queryArg && !isValidTextField(queryArg, MIN_FIELD_LENGTH, MAX_FIELD_LENGTH)) {
        errors.queryArgs.splice(i, 0, <FormattedMessage id="portal.policy.edit.matcher.invalid.error"/>)
      } else {
        errors.queryArgs.push(null)
      }
    })
  }

  return errors.queryArgs.filter(v => v).length ? errors : {}
}

class CacheKeyQueryStringForm extends React.Component {
  constructor(props) {
    super(props);

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.containsQueryArgs !== nextProps.containsQueryArgs
        || JSON.stringify(this.props.allQueryArgs) !== JSON.stringify(nextProps.allQueryArgs)) {
      if (nextProps.containsQueryArgs) {
        if (!nextProps.allQueryArgs.length
            || !!nextProps.allQueryArgs[nextProps.allQueryArgs.length - 1]) {
          this.props.dispatch(arrayPush('cache-key-query-string-form', 'queryArgs', ''))
        }
      } else {
        this.props.dispatch(arrayRemoveAll('cache-key-query-string-form', 'queryArgs'))
      }
    }
  }

  renderQueryArgs({ fields }) {
    return (
      <Panel
        className="form-panel"
        collapsible={true}
        expanded={true}
      >
        {fields.map((queryArg, i) => {
          return (
            <Field
              type="text"
              key={i}
              name={`${queryArg}`}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.policy.edit.cacheKeyQueryString.queryName.text"/>}
              required={false}
            />
          )
        })
        }
      </Panel>
    )
  }

  saveChanges({ activeFilter, queryArgs }) {
    let newName = fromJS([
      {field: 'request_host'},
      {field: 'request_path'}
    ])

    if (activeFilter === 'include_all_query_parameters') {
      newName = newName.push(Map({field: 'request_query'}))
    }

    if (activeFilter === 'include_some_parameters') {
      if (!queryArgs.length) {
        newName = newName.push(Map({
          field: 'request_query_arg',
          field_detail: ''
        }))
      }

      queryArgs.forEach(queryArg => {
        if (queryArg) {
          newName = newName.push(Map({
            field: 'request_query_arg',
            field_detail: queryArg
          }))
        }
      })
    }

    const newSet = this.props.set.set('name', newName).toJS()

    this.props.saveAction(this.props.path, this.props.setKey, newSet)
  }

  render() {
    const {handleSubmit, disabled, containsQueryArgs, invalid} = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.defaults.cacheKeyQueryString.text"/></h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <div className="form-groups">
              <InputConnector
                show={containsQueryArgs}
                className='cache-key-action-input-connector'
              />
              <Field
                name="activeFilter"
                className="input-select"
                component={FieldFormGroupSelect}
                readonly={disabled}
                label={<FormattedMessage id="portal.policy.edit.cacheKeyQueryString.cacheKey.text"/>}
                options={queryStringFilterOptions}
                required={false}
              />

              { containsQueryArgs &&
                <FieldArray
                  name="queryArgs"
                  component={this.renderQueryArgs}
                />
              }
            </div>

            <FormFooterButtons>
              <Button
                className="btn-secondary"
                id="close-button"
                onClick={this.props.close}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>
              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid}
              >
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
          </form>
        </Modal.Body>
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
  updateSet: React.PropTypes.func,
  ...reduxFormPropTypes
}

CacheKeyQueryStringForm.defaultProps = {
  allQueryArgs: [],
  containsQueryArgs: false
}

const form = reduxForm({
  form: 'cache-key-query-string-form',
  validate
})(CacheKeyQueryStringForm)

const formSelector = formValueSelector('cache-key-query-string-form')

export default connect((state, { set }) => ({
  initialValues: {
    activeFilter: parseActiveFilter(set.get('name', Map())),
    queryArgs: parseQueryArgs(set.get('name', Map()))
  },
  containsQueryArgs: formSelector(state, 'activeFilter') === 'include_some_parameters',
  allQueryArgs: formSelector(state, 'queryArgs')
}))(injectIntl(form))
