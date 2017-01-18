import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'
import { isValidAccountName } from '../../../util/validators'

//TODO Extend errorText html snippet(shows 3 to 40 characters multiline validatiot message) to separate component
// with configurable name field since we already had it duplicated in 5 forms for now + new form for SP config probably will need it
// Generalize naming for isValidAccountName util since it used for name validation in different forms(not only for account)
const validate = ({ name, description }) => {
  const conditions = {
    name: {
      condition: !isValidAccountName(name),
      errorText:
        <div>
          <FormattedMessage id="portal.network.networkForm.name.validation.error"/>,
          <div key={1}>
            <div style={{marginTop: '0.5em'}}>
              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
              <ul>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
              </ul>
            </div>
          </div>
        </div>
    },
    description: {
      condition: !isValidAccountName(description),
      errorText:
        <div>
          <FormattedMessage id="portal.network.networkForm.description.validation.error"/>,
          <div key={1}>
            <div style={{marginTop: '0.5em'}}>
              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
              <ul>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
              </ul>
            </div>
          </div>
        </div>
    }
  }
  return checkForErrors(
    { name, description },
    conditions,
    { name: <FormattedMessage id="portal.account.groupForm.name.required.error"/> }
  )
}

const NetworkForm = ({
  networkId,
  handleSubmit,
  intl,
  invalid,
  onCancel,
  onSubmit}) => {

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="name"
        placeholder={intl.formatMessage({id: 'portal.network.networkForm.name.placeholder'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.common.name" />}/>

      <Field
        name="description"
        placeholder={intl.formatMessage({id: 'portal.network.networkForm.description.placeholder'})}
        component={FieldFormGroup}
        label={intl.formatMessage({id:"portal.common.description"})} />

      <FormFooterButtons>
        <Button
          className="btn-secondary"
          onClick={onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>

        <Button
          type="submit"
          bsStyle="primary"
          disabled={invalid}>
          {networkId ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

NetworkForm.displayName = "NetworkForm"

NetworkForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  networkId: PropTypes.number,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default reduxForm({
  form: 'networkForm',
  validate
})(injectIntl(NetworkForm))
