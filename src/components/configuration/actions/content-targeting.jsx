import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import * as StatusCodes from '../../../util/status-codes'

import FieldFormGroup from '../../shared/forms/field-form-group'
import FieldFormGroupSelect from '../../shared/forms/field-form-group-select'

import { CT_DEFAULT_STATUS_CODE } from '../../../constants/configuration'

const getTypeFromStatusCode = (status_code) => {
  if (status_code >= 200 && status_code <= 299) {
    return 'allow'
  } else if (status_code >= 300 && status_code <= 399) {
    return 'redirect'
  } else if (status_code >= 400 && status_code <= 499) {
    return 'deny'
  }

  return null
}

const getDefaultStatusCodeForType = (type) => {
  switch (type) {
    case 'deny':
      return 401
    case 'redirect':
      return 302
    case 'allow':
    default:
      return 200
  }
}

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('code', set.get('code', CT_DEFAULT_STATUS_CODE))
    this.props.change('location', set.get('location'))
  }

  saveChanges(values) {
    const { invalid, path, actionType } = this.props
    const { code, location } = values

    if (!invalid) {
      const newSet = Immutable.fromJS({
        code,
        location: actionType === 'redirect' ? location : ''
      })

      this.props.saveAction(path, this.props.setKey, newSet)
    }
  }

  render() {
    const { actionType, handleSubmit, invalid, close } = this.props
    const statusOptions = [
      {value: 'allow', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.allow'})},
      {value: 'redirect', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.redirect'})},
      {value: 'deny', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.deny'})}
    ]

    const denyStatusCodeOptions = StatusCodes
                                .getPickedResponseCodes([401, 403, 404], false)
                                .map(code => {
                                  return { value: code.code, label: code.message } 
                                })

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.title.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.description.text"/></p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Field
              name="code"
              className="input-select"
              component={FieldFormGroupSelect}
              format={getTypeFromStatusCode}
              normalize={getDefaultStatusCodeForType}
              options={statusOptions}
              label={<FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.action.text" />}
            />

            {actionType === 'redirect' && // REDIRECT FORM
              <Field
                type="text"
                name="location"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.redirect.to.text" />}
                placeholder="Enter URL"
                required={true}
              />
            }

            {actionType === 'deny' && // DENY FORM
              <Field
                name="code"
                className="input-select"
                component={FieldFormGroupSelect}
                options={denyStatusCodeOptions}
                label={<FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.redirect.andPresent.text" />}
              />
            }

            <ButtonToolbar className="text-right">
              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}
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
            </ButtonToolbar>
          </form>
        </Modal.Body>
      </div>
    )
  }
}

ContentTargeting.displayName = 'ContentTargetingAction'
ContentTargeting.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map),
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'content-targeting-form'
})(ContentTargeting)

const selector = formValueSelector('content-targeting-form')

export default connect(state => {
  const code = selector(state, 'code')

  return {
    actionType: getTypeFromStatusCode(code),
    initialValues: {
      code: selector(state, 'code'),
      location: selector(state, 'location')
    }
  }
})(injectIntl(form))
