import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'
import Immutable from 'immutable'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldSortableMultiSelector from '../../../form/field-sortable-multi-selector'
import FormFooterButtons from '../../../form/form-footer-buttons'

const schemaOptions = [
  {label: 'IP address', value: 'IP'},
  {label: 'URL', value: 'URL'},
  {label: 'Referrer', value: 'REFERRER'},
  {label: 'User agent', value: 'USER_AGENT'},
  {label: 'Expires', value: 'EXPIRES'},
  {label: 'Start Date', value: 'START_DATE'},
  {label: 'End Date', value: 'END_DATE'}
]

export class TokenSchema extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    this.props.change('schema', this.props.schema)
  }

  saveChanges({ schema }) {
    this.props.dispatch(change('token-auth-form', 'schema', schema))
    this.props.close()
  }

  render() {
    const { close, handleSubmit } = this.props

    return (
      <div>
        <form onSubmit={handleSubmit(this.saveChanges)}>
          <Field
            name="schema"
            className="input-select"
            component={FieldSortableMultiSelector}
            options={schemaOptions}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />}
          />

          <FormFooterButtons>
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
              disabled={false}
            >
              <FormattedMessage id="portal.button.save"/>
            </Button>
          </FormFooterButtons>
        </form>
      </div>
    )
  }
}

TokenSchema.displayName = 'TokenSchema'
TokenSchema.propTypes = {
  close: React.PropTypes.func,
  schema: React.PropTypes.instanceOf(Immutable.List),
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'token-schema-form'
})(TokenSchema)

const selector = formValueSelector('token-auth-form')
export default connect(state => ({
  schema: selector(state, 'schema')
}))(injectIntl(form))
