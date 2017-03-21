import React, { PropTypes } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Field, FieldArray } from 'redux-form'

import Input from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import ActionButtons from '../../action-buttons'
import IconAdd from '../../icons/icon-add'

const renderMatch = ({ onRemove, onEdit, input }) => {
  return (
    <Row>
      <Col xs={10} onClick={onEdit}>
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
const renderMatches = ({ fields, openMatchModal }) => {
  return (
    <div className="conditions">
      {fields.map((match, index) => {

        const editableMatch = { ...fields.get(index), index }

        return (
          <Field
            key={index}
            name={match}
            type="text"
            component={renderMatch}
            onRemove={() => fields.remove(index)}
            onEdit={() => openMatchModal(editableMatch)}
          />
        )
      })}
    </div>
  )
}

const RuleForm = ({ edit, onSubmit, onCancel, handleSubmit, openMatchModal, invalid }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="name"
        component={Input}
        label="Rule Name"/>

        <Row className="header-btn-row">
          <Col sm={8}>
            <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button
              bsStyle="success"
              className="btn-icon btn-add-new"
              onClick={openMatchModal}>
              <IconAdd />
            </Button>
          </Col>
        </Row>

        {/* Footprints list */}
        <FieldArray
          name="matchArray"
          openMatchModal={openMatchModal}
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
          disabled={invalid}
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

}

export default injectIntl(RuleForm)
