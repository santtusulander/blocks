/*eslint-disable react/no-multi-comp*/
import React, { PropTypes } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Field, FieldArray, formValueSelector } from 'redux-form'
import { reduxForm } from 'redux-form'

import keyStrokeSupport from '../../../decorators/key-stroke-decorator'

import { checkForErrors } from '../../../util/helpers'

import TruncatedTitle from '../../shared/page-elements/truncated-title'
import PolicyWeight from '../policy-weight'
import Input from '../../shared/form-fields/field-form-group'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import ActionButtons from '../../shared/action-buttons'
import IconAdd from '../../shared/icons/icon-add'

const conditionOptions = [
  ['or', <FormattedMessage id="portal.configuration.condition.or" />],
  ['and', <FormattedMessage id="portal.configuration.condition.and" />]
]

const validate = existingRuleNames => ({ name }) => {

  const conditions = {
    name: { condition: existingRuleNames.includes(name), errorText: 'Already in use' }
  }
  return checkForErrors({ name }, conditions)
}

/**
 * Field array for matches
 */
const Matches = ({ fields, activeCondition = 'or', chooseMatch, disabled }) => {

  const matchArrayLength = fields.length
  const [ , conditionLabel ] = conditionOptions.find(([ value ]) => value === activeCondition)

  return (
    <div className="conditions">
      {fields.map((match, index) => {

        const editableMatch = { ...fields.get(index), index }
        const onEdit = () => disabled || chooseMatch(editableMatch)

        return (
          <Field
            key={index}
            name={match}
            type="text"
            component={({ input }) => (
              <Row className="condition">
                <Col xs={10} className="condition-info-column" onClick={onEdit}>
                  <TruncatedTitle content={input.value.label} />
                  {index + 1 !== matchArrayLength && <h4>{conditionLabel}</h4>}

                </Col>
                <Col xs={2} className="text-right">
                  <ActionButtons
                    className="secondary"
                    deleteDisabled={disabled}
                    onDelete={() => fields.remove(index)}/>
                </Col>
              </Row>
            )}/>
        )
      })}
    </div>
  )
}

Matches.displayName = "Matches"
Matches.propTypes = {
  activeCondition: PropTypes.string,
  chooseMatch: PropTypes.func,
  disabled: PropTypes.bool,
  fields: PropTypes.object
}

const RuleForm = ({ edit, onSubmit, activeCondition, onCancel, handleSubmit, chooseMatch, hasMatches, disabled, invalid }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="configuration-rule-edit">
      <Field
        name="name"
        required={false}
        component={Input}
        disabled={disabled}
        label={<FormattedMessage id='portal.policy.edit.editRule.ruleName.text'/>} />

        <Row className="header-btn-row">
          <Col sm={7}>
            <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
          </Col>
          <Col sm={5}>
            <div className="condition-actions-column">
              {/* Not supported in 1.5 || hasMatches &&
              <Field
                disabled={disabled}
                name="condition"
                options={conditionOptions}
                component={FormGroupSelect}/> */}
              {!hasMatches && <Button
                disabled={disabled}
                bsStyle="success"
                className="btn-icon btn-add-new"
                onClick={chooseMatch}>
                <IconAdd />
              </Button>}
            </div>
          </Col>
        </Row>

        <FieldArray
          name="matchArray"
          validate={value => !value}
          disabled={disabled}
          activeCondition={activeCondition}
          chooseMatch={chooseMatch}
          component={Matches}/>

        <Row className="header-btn-row">
          <Col sm={7}>
            <h3><FormattedMessage id="portal.policy.edit.editRule.actions.text"/></h3>
          </Col>
        </Row>
        <Field
          name="policyWeight"
          component={({ input }) => {
            return <PolicyWeight {...input} disabled={disabled}/>
          }}/>

      <FormFooterButtons>
        <Button
          id='cancel-button'
          className="btn-secondary"
          disabled={disabled}
          onClick={onCancel}>
          <FormattedMessage id='portal.common.button.cancel' />
        </Button>
        <Button
          id='submit-button'
          type='submit'
          disabled={invalid || disabled}
          bsStyle="primary">
          {edit
            ? <FormattedMessage id='portal.common.button.save' />
            : <FormattedMessage id='portal.common.button.add' />}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

RuleForm.displayName = 'RuleForm'
RuleForm.propTypes = {
  activeCondition: PropTypes.string,
  chooseMatch: PropTypes.func,
  disabled: PropTypes.bool,
  edit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  hasMatches: PropTypes.bool,
  invalid: PropTypes.bool,
  onCancel: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onSubmit: PropTypes.func
}

/* istanbul ignore next */
const mapStateToProps = (state, { initialValues = {} }) => {
  const rules = formValueSelector('gtmForm')(state, 'rules') || []

  const existingRuleNames = rules.reduce((aggregate, rule) => {
    if (rule.name !== initialValues.name) {
      aggregate.push(rule.name)
    }
    return aggregate
  }, [])

  return {
    validate: validate(existingRuleNames)
  }
}

export default connect(mapStateToProps)(reduxForm({ form: 'traffic-rule-form', validate })(keyStrokeSupport(RuleForm)))
