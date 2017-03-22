/*eslint-disable react/no-multi-comp*/
import React, { PropTypes } from 'react'
import { Button, Col, Row, ButtonToolbar } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Field, FieldArray } from 'redux-form'

import Input from '../../form/field-form-group'
import FormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import ActionButtons from '../../action-buttons'
import IconAdd from '../../icons/icon-add'

const Matches = ({ fields, chooseMatch, disabled }) => {
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
                <Col xs={10} onClick={onEdit}>
                  <p>{input.value.label}</p>
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
  chooseMatch: PropTypes.func,
  fields: PropTypes.object
}

const RuleForm = ({ edit, onSubmit, onCancel, handleSubmit, chooseMatch, hasMatches, disabled, invalid }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="configuration-rule-edit">
      <Field
        name="name"
        required={false}
        component={Input}
        label={<FormattedMessage id='portal.policy.edit.editRule.ruleName.text'/>} />

        <Row className="header-btn-row">
          <Col sm={7}>
            <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
          </Col>
          <Col sm={5}>
            <ButtonToolbar className="pull-right extra-margin-top" bsClass="btn-toolbar">
              {hasMatches &&
              <Field
                disabled={disabled}
                name="condition"
                options={[['or', 'OR'], ['and', 'AND']]}
                component={FormGroupSelect}/>}
              <Button
                disabled={disabled}
                bsStyle="success"
                className="btn-icon btn-add-new pull-right"
                onClick={chooseMatch}>
                <IconAdd />
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>

        <FieldArray
          name="matchArray"
          disabled={disabled}
          chooseMatch={chooseMatch}
          component={Matches}/>

        <h3><FormattedMessage id="portal.policy.edit.editRule.actions.text"/></h3>

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
  chooseMatch: PropTypes.func,
  disabled: PropTypes.bool,
  edit: PropTypes.func,
  handleSubmit: PropTypes.func,
  hasMatches: PropTypes.bool,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default RuleForm
