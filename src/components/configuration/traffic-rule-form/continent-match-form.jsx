import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import continents from '../../../constants/continents'
import { checkForErrors } from '../../../util/helpers'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ continents }) => checkForErrors({ continents })

const ContinentMatchForm = ({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid, intl }) => {

  const options = continents.map(({ id, labelId }) => ({ id, label: intl.formatMessage({ id: labelId }) }))

  const saveMatch = values => {
    const labelText = values.continents.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({
      values,
      label: <FormattedMessage id="portal.configuration.traffic.rules.match.continent.items" values={{ items: labelText }} />,
      matchType
    }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="continents"
        component={Typeahead}
        placeholder={intl.formatMessage({ id: "portal.configuration.traffic.rules.match.continent.input.placeholder" })}
        multiple={true}
        options={options}
        label={<FormattedMessage id="portal.configuration.traffic.rules.match.continent" />}/>
      <FormFooterButtons>
        <Button
          id='cancel-button'
          className="btn-outline"
          onClick={onCancel}>
          <FormattedMessage id='portal.common.button.cancel' />
        </Button>
        <Button
          id='submit-button'
          type='submit'
          disabled={invalid}
          bsStyle="primary">
          {typeof matchIndex === 'number'
            ? <FormattedMessage id='portal.common.button.save' />
            : <FormattedMessage id='portal.common.button.add' />}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

ContinentMatchForm.displayName = 'ContinentMatchForm'
ContinentMatchForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  matchIndex: PropTypes.number,
  matchType: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

const Form = reduxForm({ form: 'continents-traffic-match', validate })(injectIntl(ContinentMatchForm))
Form.defaultProps = { initialValues: { continents: [] } }
export default Form
