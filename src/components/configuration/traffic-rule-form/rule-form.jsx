import React, { PropTypes } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field, FieldArray } from 'redux-form'

import Input from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import ActionButtons from '../../action-buttons'
import IconAdd from '../../icons/icon-add'

const renderMatch = ({ onRemove, input }) => {
  return (
    <Row>
      <Col xs={10}>
        <p>{input.value.label}</p>
      </Col>
      <Col xs={2} className="text-right">
        <ActionButtons
          className="secondary"
          onDelete={onRemove}/>
      </Col>
    </Row>
  )
}
const renderMatches = ({ fields }) => {
  return (
    <div className="conditions">
      {
        fields.map((match, index) =>
          <Field
            key={index}
            name={`${match}`}
            type="text"
            component={renderMatch}
            onRemove={() => fields.remove(index)}
          />
        )
      }
    </div>
  )
}

const RuleForm = ({ submitting, edit, onSubmit, onCancel, handleSubmit, onAddMatchClick, invalid }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="name"
        component={Input}
        label={<FormattedMessage id="portal.account.recordForm.selectRecordType.label"/>}/>

        <Row className="header-btn-row">
          <Col sm={8}>
            <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button
              bsStyle="success"
              className="btn-icon btn-add-new"
              onClick={onAddMatchClick}>
              <IconAdd />
            </Button>
          </Col>
        </Row>

        {/* Footprints list */}
        <FieldArray
          name="matchArray"
          component={renderMatches}/>

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
          disabled={invalid || submitting}
          bsStyle="primary">
          {submitting
            ? <FormattedMessage id='portal.common.button.saving' />
            : edit
              ? <FormattedMessage id='portal.common.button.save' />
              : <FormattedMessage id='portal.common.button.add' />}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

RuleForm.displayName = 'RuleForm'
RuleForm.propTypes = {

}

export default injectIntl(RuleForm)
