import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ButtonToolbar, FormGroup, ControlLabel } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { isValidTextField, isValidIPv4Address } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'

const validateTypeaheadToken = (item) => {
  return item.label && isValidIPv4Address(item.label)
}

const validate = ({ name, description, UDNType }) => {
  const conditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.footprintForm.name.invalid.text"/>
    },
    description: {
      condition: !isValidTextField(description),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.description"/>
    }
  }

  return checkForErrors(
    { name, description, UDNType },
    conditions,
    {
      name: <FormattedMessage values={{ field: 'Footprint Name' }}
                                       id="portal.network.footprintForm.field.required.text"/>,
      description: <FormattedMessage values={{ field: 'Footprint Description' }}
                                              id="portal.network.footprintForm.field.required.text"/>
    }
  )
}

class FootprintForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    this.props.onSubmit(values)
  }

  renderDropZone() {
    // TODO: DropZone component
    return (
      <p>DropZone component here</p>
    )
  }

  render() {
    const {
      addManual,
      editing,
      fetching,
      handleSubmit,
      intl,
      invalid,
      onCancel,
      onDelete,
      submitting,
      udnTypeOptions
    } = this.props

    const submitButtonLabel = editing
      ? <FormattedMessage id="portal.button.save"/>
      : <FormattedMessage id="portal.button.add"/>


    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
          <span className='submit-error'>
          {this.props.error}
          </span>

        <FormGroup>
          <Field
            name="addFootprintMethod"
            type="radio"
            value="manual"
            component={FieldRadio}
            label={<FormattedMessage id="portal.network.footprintForm.checkbox.option.manual.text"/>}
          />

          <Field
            name="addFootprintMethod"
            type="radio"
            value="addfile"
            component={FieldRadio}
            label={<FormattedMessage id="portal.network.footprintForm.checkbox.option.useCSV.text"/>}
          />
        </FormGroup>

        { addManual === 'manual' &&
        <div>
          <FormGroup>
            <Field
              type="text"
              name="name"
              placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.name.placeholder.text' })}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.network.footprintForm.name.title.text"/>}
            />

            <Field
              name="description"
              type="text"
              placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.description.placeholder.text' })}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.network.footprintForm.description.title.text"/>}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.network.footprintForm.dataType.title.text"/>
            </ControlLabel>
            <Field
              name="data_type"
              type="radio"
              value="ipv4cidr"
              component={FieldRadio}
              label={<FormattedMessage id="portal.network.footprintForm.dataType.option.cidr.text"/>}
            />

            <Field
              type="radio"
              name="data_type"
              value="asnlist"
              component={FieldRadio}
              label={<FormattedMessage id="portal.network.footprintForm.dataType.option.asn.text"/>}
            />

            <Field
              required={true}
              name="value"
              allowNew={true}
              component={FieldFormGroupTypeahead}
              multiple={true}
              options={[]}
              validation={validateTypeaheadToken}
            />

          </FormGroup>

          <Field
            name="udn_type"
            className="input-select"
            component={FieldFormGroupSelect}
            options={udnTypeOptions}
            label={<FormattedMessage id="portal.network.footprintForm.UDNType.title.text"/>}
          />
        </div>
        }

        { addManual !== 'manual' && this.renderDropZone()}

        <FormFooterButtons autoAlign={false}>
          { editing &&
          <ButtonToolbar className="pull-left">
            <Button
              id="delete-btn"
              className="btn-danger"
              disabled={submitting || fetching}
              onClick={onDelete}>
              {
                fetching
                  ? <FormattedMessage id="portal.button.deleting"/>
                  : <FormattedMessage id="portal.button.delete"/>
              }
            </Button>
          </ButtonToolbar>
          }
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting}>
            {submitButtonLabel}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

FootprintForm.displayName = "FootprintForm"
FootprintForm.propTypes = {
  ASNOptions: PropTypes.array,
  CIDROptions: PropTypes.array,
  editing: PropTypes.bool,
  fetching: PropTypes.bool,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  show: PropTypes.bool,
  ...reduxFormPropTypes,
  udnTypeOptions: PropTypes.array
}

const form = reduxForm({
  form: 'footprintForm',
  validate
})(FootprintForm)

const selector = formValueSelector('footprintForm')

const mapStateToProps = (state) => {
  const addManual = selector(state, 'addFootprintMethod')
  const dataType = selector(state, 'dataType')

  return {
    addManual,
    dataType,
    selector,
    initialValues: {
      addFootprintMethod: 'manual',
      value: [],
      data_type: 'ipv4cidr'
    }
  }
}


export default connect(mapStateToProps)(injectIntl(form))
