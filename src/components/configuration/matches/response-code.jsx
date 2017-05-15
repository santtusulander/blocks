import React from 'react'
import { Button, Col, ControlLabel, Modal, Row } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { fromJS, Map, List } from 'immutable'
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'

import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import FieldFilterChecklistDropdown from '../../shared/form-fields/field-filter-checklist-dropdown'

import { HTTP_RESPONSES } from '../../../util/status-codes'

const responseCodesOptions = fromJS(HTTP_RESPONSES.map(code => ({ value: code.code, label: code.code })))

const getCodesFromMatch = (match) => {
  const value = match.get('value')
  const allCodes = responseCodesOptions.map(rc => rc.get('value'))

  if (value) {
    return allCodes.reduce((acc, code) => {
      if (new RegExp(value).test(code)) {
        acc = acc.concat([code])
      }
      return acc
    }, [])
  } else {
    return []
  }
}

const validate = ({ codes = List() }) => {
  const errors = {}

  if (codes.size === 0) {
    errors.codes = <FormattedMessage id="portal.policy.edit.action.responseCodes.required.error"/>
  }

  return errors
}

class ResponseCode extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  saveChanges({ codes = List() }) {
    const matchCase = codes.toJS().join('|')
    let newMatch = this.props.match

    newMatch = newMatch.delete('_temp')
    newMatch = newMatch.set('type', 'regexp')
    newMatch = newMatch.set('value', matchCase)

    this.props.changeValue(this.props.path, newMatch)
    this.props.activateMatch(null)
  }

  render() {
    const { handleSubmit, invalid, close } = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.responseCode.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.responseCode.disclaimer.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Row className="form-group">
              <Col xs={4} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.responseCode.codes.text"/>
                  <FormattedMessage id="portal.colonWithSpace"/>
                </ControlLabel>
              </Col>
              <Col xs={8}>
                <Field
                  className="pull-right"
                  name="codes"
                  component={FieldFilterChecklistDropdown}
                  options={responseCodesOptions}
                  defaultAllSelected={false}
                />
              </Col>
            </Row>

            <FormFooterButtons>
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
            </FormFooterButtons>
          </form>
        </Modal.Body>
      </div>
    )
  }
}

ResponseCode.displayName = 'ResponseCode'
ResponseCode.propTypes = {
  activateMatch: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Map),
  path: React.PropTypes.instanceOf(List),
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'response-code-form',
  validate,
  touchOnChange: true
})(ResponseCode)

export default connect((state, { match }) => ({
  initialValues: {
    codes: fromJS(getCodesFromMatch(match))
  }
}))(injectIntl(form))
