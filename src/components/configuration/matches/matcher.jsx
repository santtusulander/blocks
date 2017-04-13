import React from 'react'
import { Button, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm, 
         formValueSelector, 
         propTypes as reduxFormPropTypes 
       } from 'redux-form'

import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import InputConnector from '../../shared/page-elements/input-connector'
import { getMatchFilterType } from '../../../util/policy-config'
import { isValidTextField } from '../../../util/validators'

const MIN_FIELD_LENGTH = 1
const MAX_FIELD_LENGTH = 255

const validate = ({ val, containsVal, activeFilter }, props) => {
  const errors = {}

  errors.val = !val ? <FormattedMessage id="portal.policy.edit.matcher.required.error"/> :
               !isValidTextField(val, MIN_FIELD_LENGTH, MAX_FIELD_LENGTH) ? <FormattedMessage id="portal.policy.edit.matcher.invalid.error"/> : null

  if (props.hasFieldDetail && hasValueField(activeFilter)) {
    errors.containsVal = !containsVal ? <FormattedMessage id="portal.policy.edit.matcher.required.error"/> :
                         !isValidTextField(containsVal, MIN_FIELD_LENGTH, MAX_FIELD_LENGTH) ? <FormattedMessage id="portal.policy.edit.matcher.invalid.error"/> : null
  }

  return errors
}

const hasValueField = (filter) => {
  return filter === 'equals' ||
         filter === 'does_not_equal' ||
         filter === 'contains' ||
         filter === 'does_not_contain'
}

class Matcher extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
    this.getFilterOptions = this.getFilterOptions.bind(this)
  }

  saveChanges(values) {
    let newMatch = this.props.match
    const { activeFilter, containsVal, val } = values

    newMatch = newMatch.delete('_temp')

    switch (activeFilter) {
      case 'exists':
        newMatch = newMatch.set('type', 'exists')
                           .set('value', '')
                           .set('inverted', false)
        break
      case 'contains':
        newMatch = newMatch.set('type', 'substr')
                           .set('value', val)
                           .set('inverted', false)
        break
      case 'equals':
        newMatch = newMatch.set('type', 'equals')
                           .set('value', val)
                           .set('inverted', false)
        break
      case 'empty':
        newMatch = newMatch.set('type', 'empty')
                           .set('value', '')
                           .set('inverted', false)
        break
      case 'does_not_exist':
        newMatch = newMatch.set('type', 'exists')
                           .set('value', '')
                           .set('inverted', true)
        break
      case 'does_not_contain':
        newMatch = newMatch.set('type', 'substr')
                           .set('value', val)
                           .set('inverted', true)
        break
      case 'does_not_equal':
        newMatch = newMatch.set('type', 'equals')
                           .set('value', val)
                           .set('inverted', true)
        break
      case 'does_not_empty':
        newMatch = newMatch.set('type', 'empty')
                           .set('value', '')
                           .set('inverted', true)
        break
    }

    if (this.props.hasFieldDetail) {
      newMatch = newMatch.set('field_detail', val)
                         .set('value', containsVal)
    }

    this.props.changeValue(this.props.path, newMatch)
    this.props.activateMatch(null)
  }

  getFilterOptions() {
    const matchOpts = []

    if (this.props.hasExists) {
      matchOpts.push(['exists', <FormattedMessage id="portal.policy.edit.matcher.exists.text"/>])
      matchOpts.push(['does_not_exist', <FormattedMessage id="portal.policy.edit.matcher.doesntExist.text"/>])
    }

    if (this.props.hasContains) {
      matchOpts.push(['contains', <FormattedMessage id="portal.policy.edit.matcher.contains.text"/>])
      matchOpts.push(['does_not_contain', <FormattedMessage id="portal.policy.edit.matcher.doesntContain.text"/>])
    }

    if (this.props.hasEquals) {
      matchOpts.push(['equals', <FormattedMessage id="portal.policy.edit.matcher.equals.text"/>])
      matchOpts.push(['does_not_equal', <FormattedMessage id="portal.policy.edit.matcher.doesntEqual.text"/>])
    }

    if (this.props.hasEmpty) {
      matchOpts.push(['empty', <FormattedMessage id="portal.policy.edit.matcher.empty.text"/>])
      matchOpts.push(['does_not_empty', <FormattedMessage id="portal.policy.edit.matcher.doesntEmpty.text"/>])
    }

    return matchOpts
  }

  render() {
    const { handleSubmit, invalid, getActiveFilter, hasFieldDetail } = this.props
    const hasContainingRule = hasFieldDetail && hasValueField(getActiveFilter)

    return (
      <div>
        <Modal.Header>
          <h1>{this.props.name}</h1>
          <p>{this.props.description}</p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            {(this.props.hasFieldDetail || hasValueField(getActiveFilter)) &&
              <Field
                type="text"
                name="val"
                component={FieldFormGroup}
                label={this.props.label}
                placeholder={this.props.placeholder}
              />
            }

            <div className="form-groups">
              <InputConnector
                show={hasContainingRule}
                noLabel={true}
              />
              <Field
                name="activeFilter"
                className="input-select"
                component={FieldFormGroupSelect}
                options={this.getFilterOptions()}
              />
              <Panel
                className="form-panel"
                collapsible={true}
                expanded={hasContainingRule}
              >
                <Field
                  type="text"
                  name="containsVal"
                  component={FieldFormGroup}
                  label={<FormattedMessage id="portal.policy.edit.matcher.value.text" />}
                />
              </Panel>
            </div>

            <FormFooterButtons>
              <Button
                className="btn-secondary"
                onClick={this.props.close}
              >
                <FormattedMessage id="portal.policy.edit.policies.cancel.text" />
              </Button>
              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid}
              >
                <FormattedMessage id="portal.policy.edit.policies.saveMatch.text" />
              </Button>
            </FormFooterButtons>
          </form>
        </Modal.Body>
      </div>
    )
  }
}

Matcher.displayName = 'Matcher'
Matcher.propTypes = {
  activateMatch: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  description: React.PropTypes.string,
  hasContains: React.PropTypes.bool,
  hasEmpty: React.PropTypes.bool,
  hasEquals: React.PropTypes.bool,
  hasExists: React.PropTypes.bool,
  hasFieldDetail: React.PropTypes.bool,
  label: React.PropTypes.string,
  match: React.PropTypes.instanceOf(Immutable.Map),
  name: React.PropTypes.string,
  path: React.PropTypes.instanceOf(Immutable.List),
  placeholder: React.PropTypes.string,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'matcher-form',
  validate
})(Matcher)

const matcherFormSelector = formValueSelector('matcher-form')

const mapStateToProps = (state, props) => {
  const { hasFieldDetail, match } = props
  const fieldDetail = match.get('field_detail')
  const value = match.get('value')
  const containsVal = hasFieldDetail ? value : ''

  return {
    getActiveFilter: matcherFormSelector(state, 'activeFilter'),
    initialValues: {
      val: fieldDetail || value,
      containsVal: containsVal,
      activeFilter: getMatchFilterType(match)
    }
  }
}

export default connect(mapStateToProps)(form)
