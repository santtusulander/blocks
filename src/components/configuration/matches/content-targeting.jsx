import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { List, fromJS, Map } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import classNames from 'classnames'

import FieldFormGroupSelect from '../../shared/forms/field-form-group-select'
import FieldFormGroupTypeahead from '../../shared/forms/field-form-group-typeahead'

import country_list from '../../../constants/country-list'

const getFormattedCountry = (item) => ({
  id: item,
  label: country_list.find(ctr => ctr.id === item).label
})

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props);

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { match, change } = this.props
    const countries = match.get('value')

    if (countries && countries.size) {
      change('value', countries.toJS().map(getFormattedCountry))
    }

    change('inverted', match.get('inverted'))
  }

  saveChanges({value, inverted}) {
    const { path, match, changeValue, activateMatch } = this.props

    changeValue(path, fromJS({
      field: match.get('field'),
      type: 'in',
      inverted,
      value: value.map(item => item.id)
    }))
    activateMatch(null)
  }

  render() {
    const { handleSubmit, invalid, close, exclude, value } = this.props
    const typeOptions = [
      {value: 'in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersFrom'})},
      {value: 'not_in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersNotFrom'})}
    ]
    const countryOptions = country_list.filter(country => value.indexOf(country) < 0)
    const label = exclude
                  ? <FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.exclude.text" />
                  : <FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.include.text" />

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
              format={(v) => {
                return v ? 'not_in' : 'in'
              }}
              normalize={(v) => !(v === 'in')}
              label={label}
            />

            <Field
              className={classNames({'exclude': exclude})}
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
  activateMatch: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  exclude: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Map),
  path: React.PropTypes.instanceOf(List),
  value: React.PropTypes.array,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'content-targeting-form'
})(ContentTargeting)

ContentTargeting.defaultProps = {
  inverted: false,
  value: []
}

const selector = formValueSelector('content-targeting-form')

export default connect(state => ({
  exclude: selector(state, 'inverted')
}))(injectIntl(form))
