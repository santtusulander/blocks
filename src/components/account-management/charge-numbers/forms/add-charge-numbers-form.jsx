import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import FormFooterButtons from '../../../form/form-footer-buttons'
import { injectIntl, FormattedMessage } from 'react-intl'
import { reduxForm, Field, FieldArray, propTypes as reduxFormPropTypes} from 'redux-form'
import { fromJS, Map, List } from 'immutable'

import FieldFormGroup from '../../../form/field-form-group'
import FieldFormGroupCheckboxes from '../../../form/field-form-group-checkboxes'
import ChargeNumbersField from './charge-numbers-field'
import RegionsField from './regions-field'

import { checkForErrors } from '../../../../util/helpers'
import { isValidChargeNumber } from '../../../../util/validators'
import { getRegionsInfoOptions } from '../../../../util/services-helpers'

import { FLOW_DIRECTION_TYPES } from '../../../../constants/account-management-options'

const validate = ({ billing_meta: { charge_number = '', regions, flow_direction } }) => {
  const conditions = {
    charge_number: [
      {
        condition: !charge_number,
        errorText: <FormattedMessage id="portal.account.chargeNumbersForm.charge_number.validationError" />
      },
      {
        condition: !isValidChargeNumber(charge_number),
        errorText: <FormattedMessage id="portal.account.chargeNumbersForm.charge_number.validationError" />
      }
    ],
    regions: [
      {
        condition: regions && !(regions.reduce((acc, {charge_number}) => acc && isValidChargeNumber(charge_number), true)),
        errorText: <FormattedMessage id="portal.account.chargeNumbersForm.regions.validationError" />
      }
    ]
  }

  const errors = checkForErrors({charge_number, regions, flow_direction}, conditions)

  //model can contains only one of [charge_number, regions] property
  regions && delete errors.charge_number
  charge_number && delete errors.regions
  !flow_direction && delete errors.flow_direction

  if (errors.regions) {
    errors.regions = { _error: errors.regions }
  }

  return Object.keys(errors).length ? { billing_meta: {...errors} } : {}
}

class AddChargeNumbersForm extends React.Component {
  constructor(props) {
    super(props)

    this.onEnable = this.onEnable.bind(this)
  }

  onEnable(data) {
    const activeServiceItem = this.props.activeServiceItem.toJS()
    const mergedItem = Object.assign({}, activeServiceItem, data)

    this.props.onSubmit(fromJS(mergedItem))
  }

  render() {
    const { hasFlowDirection, hasGlobalBilling, hasRegionalBilling, onDisable, onCancel, regionsInfo, invalid } = this.props

    return (
      <form onSubmit={this.props.handleSubmit(this.onEnable)}>
        { hasFlowDirection && 
          <div>
            <Field
              name="billing_meta.flow_direction"
              component={FieldFormGroupCheckboxes}
              iterable={FLOW_DIRECTION_TYPES}
              required={true}
              label={<FormattedMessage id="portal.account.chargeNumbersForm.flow_direction.title" />}
            />
            <hr/>
          </div>
        }

        { hasRegionalBilling && hasGlobalBilling &&
          <Field
            name="billing_meta"
            component={ChargeNumbersField}
            regionsInfo={regionsInfo}
          />
        }

        { !hasRegionalBilling && hasGlobalBilling &&
          <Field
            type="text"
            name="billing_meta.charge_number"
            component={FieldFormGroup}
            required={true}
            label={<FormattedMessage id="portal.account.chargeNumbersForm.global_charge_number.title" />}
            normalize={value => value.toUpperCase()}
          />
        }

        { !hasGlobalBilling && hasRegionalBilling &&
          <FieldArray
            name="billing_meta.regions"
            component={RegionsField}
            iterable={getRegionsInfoOptions(regionsInfo)}
            label={<FormattedMessage id="portal.account.chargeNumbersForm.regions.title"/>}
            required={true}
          />
        }

        <FormFooterButtons>
          <Button
            id='disable-button'
            className="btn-danger pull-left"
            onClick={onDisable}
          >
            <FormattedMessage id='portal.common.button.disable' />
          </Button>
          <Button
            id='cancel-button'
            className="btn-outline"
            onClick={onCancel}
          >
            <FormattedMessage id='portal.common.button.cancel' />
          </Button>
          <Button
            id='submit-button'
            disabled={invalid}
            type='submit'
            bsStyle="primary"
          >
            <FormattedMessage id='portal.common.button.enable' />
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

AddChargeNumbersForm.displayName = 'AddChargeNumbersForm'
AddChargeNumbersForm.propTypes = {
  activeServiceItem: PropTypes.instanceOf(Map),
  handleSubmit: PropTypes.func,
  hasFlowDirection: PropTypes.bool,
  hasGlobalBilling: PropTypes.bool,
  hasRegionalBilling: PropTypes.bool,
  onCancel: PropTypes.func,
  onDisable: PropTypes.func,
  onSubmit: PropTypes.func,
  ...reduxFormPropTypes,
  regionsInfo: PropTypes.instanceOf(List)
}

export default reduxForm({
  form: 'AddChargeNumbersForm',
  validate
})(injectIntl(AddChargeNumbersForm))
