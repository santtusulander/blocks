import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'
import Immutable from 'immutable'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldSortableMultiSelector from '../../../form/field-sortable-multi-selector'
import FormFooterButtons from '../../../form/form-footer-buttons'

import { SCHEMA_OPTIONS } from '../../../../constants/configuration'

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
    const { close, handleSubmit, selectedSchema, intl } = this.props
    const schemaOptions = SCHEMA_OPTIONS.map(({value, label}) => ({value, label: intl.formatMessage({id: label}) }))
    const getLabels = () => {
      return selectedSchema.reduce((acc, schema) => {
        return acc.concat([schemaOptions.find(option => option.value === schema).label])
      }, []).join(' + ')
    }

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

          <h6>
            <FormattedMessage id="portal.policy.edit.tokenauth.schema_string.text" />
          </h6>
          <strong>
            { selectedSchema && getLabels() }
          </strong>

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
              disabled={!selectedSchema.size}
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
  intl: React.PropTypes.object,
  schema: React.PropTypes.instanceOf(Immutable.List),
  selectedSchema: React.PropTypes.instanceOf(Immutable.List),
  ...reduxFormPropTypes
}

TokenSchema.defaultProps = {
  selectedSchema: Immutable.List()
}

const form = reduxForm({
  form: 'token-schema-form'
})(TokenSchema)

const selector = formValueSelector('token-auth-form')
const selfSelector = formValueSelector('token-schema-form')

export default connect(state => ({
  schema: selector(state, 'schema'),
  selectedSchema: selfSelector(state, 'schema')
}))(injectIntl(form))
