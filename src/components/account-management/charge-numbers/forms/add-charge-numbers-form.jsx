import React, { PropTypes } from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import FormFooterButtons from '../../../form/form-footer-buttons'
import { injectIntl, FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { fromJS } from 'immutable'

import FieldFormGroup from '../../../form/field-form-group'
import FieldFormGroupCheckboxes from '../../../form/field-form-group-checkboxes'
import ChargeNumbersField from './charge-numbers-field'

import { FLOW_DIRECTION_TYPES } from '../../../../constants/account-management-options'

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
    const { hasFlowDirection, hasRegionalBilling, onDisable, onCancel } = this.props

    return (
      <form
        onSubmit={this.props.handleSubmit(this.onEnable)}
      >
        { hasFlowDirection && 
          <div>
            <Field
              name="flow_direction"
              component={FieldFormGroupCheckboxes}
              iterable={FLOW_DIRECTION_TYPES}
              required={false}
              label={<FormattedMessage id="portal.account.chargeNumbersForm.flow_direction.title" />}
            />
            <hr/>
          </div>
        }

        { hasRegionalBilling && 
          <Field
            name="billing_meta"
            component={ChargeNumbersField}
          />
        }

        { !hasRegionalBilling && 
          <Field
            type="text"
            name="billing_meta.charge_number"
            component={FieldFormGroup}
            required={false}
            label={<FormattedMessage id="portal.account.chargeNumbersForm.global_charge_number.title" />}
          />
        }

        <FormFooterButtons autoAlign={false}>
          <ButtonToolbar className="pull-left">
            <Button
              id='disable-button'
              bsStyle="danger"
              onClick={onDisable}
            >
              <FormattedMessage id='portal.common.button.disable' />
            </Button>
          </ButtonToolbar>

          <ButtonToolbar className="pull-right">
            <Button
              id='cancel-button'
              className="btn-outline"
              onClick={onCancel}
            >
              <FormattedMessage id='portal.common.button.cancel' />
            </Button>
            <Button
              id='submit-button'
              type='submit'
              bsStyle="primary"
            >
              <FormattedMessage id='portal.common.button.enable' />
            </Button>
          </ButtonToolbar>
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
  hasRegionalBilling: PropTypes.bool,
  onCancel: PropTypes.func,
  onDisable: PropTypes.func,
  onSubmit: PropTypes.func
}

export default reduxForm({
  form: 'AddChargeNumbersForm'
})(injectIntl(AddChargeNumbersForm))
