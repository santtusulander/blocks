import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import { checkForErrors } from '../../../util/helpers'

import SidePanel from '../../side-panel'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = () => {
  const conditions = {}

  return checkForErrors({}, conditions)

}

class RoutingDaemonForm extends React.Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props
  }

  render() {
    const {
      handleSubmit,
      intl,
      invalid,
      onCancel,
      show,
      submitting,
    } = this.props

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: 'portal.account.roleEdit.title' })}
        subTitle={intl.formatMessage({ id: 'portal.account.roleEdit.disclaimer.text' })}
        cancel={onCancel}
      >
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <FormFooterButtons>
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
              <FormattedMessage id="portal.button.save"/>
            </Button>
          </FormFooterButtons>
        </form>
      </SidePanel>
    )
  }
}

RoutingDaemonForm.displayName = 'RoutingDaemonForm'
RoutingDaemonForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  submitting: PropTypes.bool
}

const form = reduxForm({
  form: 'routing-daemon',
  validate
})(RoutingDaemonForm)

export default injectIntl(form)
