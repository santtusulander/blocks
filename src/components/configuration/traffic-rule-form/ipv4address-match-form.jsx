import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { isValidIP } from '../../../util/validators'

import Typeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = ({ ipv4Address = [] }) => {
  if (!ipv4Address.length) {
    return { ipv4CIDR: 'Required.' }
  }

  for(const value of ipv4Address) {

    if (!isValidIP(value.label)) {
      return { ipv4Address: 'Some of the values you entered could not be resolved as IPv4 addresses.' }
    }
  }
}

export default reduxForm({ form: 'ipv4Address-traffic-match', validate })(({ onSave, onCancel, matchIndex, matchType, handleSubmit, invalid }) => {

  const saveMatch = values => {
    const labelText = values.ipv4Address.reduce((string, { label }, index) => `${string}${index ? ',' : ''} ${label}`, '')
    onSave({ values, label: `IPv4 Addresses: ${labelText}`, matchType }, matchIndex)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit(saveMatch)}>
      <Field
        name="ipv4Address"
        component={Typeahead}
        placeholder={"Enter IPv4 addresses, eg. 10.1.1.1"}
        multiple={true}
        allowNew={true}
        options={[]}
        validation={(value) => value && isValidIP(value.label)}
        label="IPv4 Address"/>
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
})
