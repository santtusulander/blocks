import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { List, fromJS } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'

import country_list from '../../../constants/country-list'

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props);

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { match } = this.props

    this.props.change('value', match.get('value').toJS().map(item => ({id: item, label: country_list.find(ctr => ctr.id === item ).label})))
    this.props.change('inverted', match.get('inverted'))
  }

  saveChanges({value, inverted}) {
    const { match } = this.props

    this.props.changeValue(this.props.path, fromJS({
      field: match.get('field'),
      type: match.get('type'),
      inverted,
      value: value.map(item => item.id)
    }))
    this.props.activateMatch(null)
  }

  render() {
    const { handleSubmit, invalid, close, exclude, countries } = this.props
    const typeOptions = [
      {value: 'in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersFrom'})},
      {value: 'not_in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersNotFrom'})}
    ]
    const countryOptions = country_list.filter(country => countries.indexOf(country) < 0)

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.matchesSelection.contentTargeting.text" /></h1>
          <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.text" /></p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Field
              name="inverted"
              className="input-select"
              component={FieldFormGroupSelect}
              options={typeOptions}
              format={(v) => v ? 'in' : 'not_in'}
              normalize={(v) => v === 'in' ? true : false}
              label={<FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.action.text" />}
            />

            <Field
              className={exclude ? 'exclude' : ''}
              name="value"
              component={FieldFormGroupTypeahead}
              multiple={true}
              options={countryOptions}
            />

            <hr />

            <ButtonToolbar className="text-right">
              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}
              >
                <FormattedMessage id="portal.policy.edit.policies.cancel.text"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid}
              >
                <FormattedMessage id="portal.policy.edit.policies.saveMatch.text"/>
              </Button>

            </ButtonToolbar>
          </form>
        </Modal.Body>
      </div>
    )
  }
}

ContentTargeting.displayName = 'ContentTargeting'
ContentTargeting.propTypes = {
  close: React.PropTypes.func,
  path: React.PropTypes.instanceOf(List),
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'content-targeting-form'
})(ContentTargeting)

ContentTargeting.defaultProps = {
  inverted: false,
  value: [],
  countries: []
}

const selector = formValueSelector('content-targeting-form')

export default connect(state => ({
  exclude: selector(state, 'inverted'),
  countries: selector(state, 'value'),
  value: selector(state, 'value'),
  inverted: selector(state, 'inverted')
}))(injectIntl(form))
