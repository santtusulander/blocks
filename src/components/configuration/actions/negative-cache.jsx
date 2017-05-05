import React from 'react'
import { Button, Col, ControlLabel, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import FieldFormGroupNumber from '../../shared/form-fields/field-form-group-number'
import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../../shared/form-fields/field-form-group-toggle'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

import { secondsToUnit, unitFromSeconds, secondsFromUnit } from '../helpers'
import { MIN_TTL, MAX_TTL } from '../../../constants/configuration'

const ttlUnitOptions = [
  {value: 'seconds', label: <FormattedMessage id="portal.units.seconds"/>},
  {value: 'minutes', label: <FormattedMessage id="portal.units.minutes"/>},
  {value: 'hours', label: <FormattedMessage id="portal.units.hours"/>},
  {value: 'days', label: <FormattedMessage id="portal.units.days"/>}
]

const sourceOptions = [
  {value: 'local,cluster,origin', label: <FormattedMessage id="portal.policy.edit.negativeCache.source.all"/>},
  {value: 'local', label: <FormattedMessage id="portal.policy.edit.negativeCache.source.local"/>},
  {value: 'cluster', label: <FormattedMessage id="portal.policy.edit.negativeCache.source.cluster"/>},
  {value: 'origin', label: <FormattedMessage id="portal.policy.edit.negativeCache.source.origin"/>}
]

const DEFAULT_TTL = 10
const sourceDefaultValue = 'local,cluster,origin'

const validate = ({ cacheable, ttlValue, ttlUnit }) => {
  const errors = {}
  const max_age = secondsFromUnit(ttlValue, ttlUnit)

  if (cacheable && (!max_age && max_age !== null)) {
    errors.ttlValue = <FormattedMessage id="portal.policy.edit.matcher.required.error" />
  }

  return errors
}

class NegativeCache extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('cacheable', set.get('cacheable', false))
    this.props.change('source', set.get('source', sourceDefaultValue))
    this.props.change('body', set.get('body', ''))

    const ttl = set.get('max_age', DEFAULT_TTL)
    const ttlUnit = unitFromSeconds(ttl)
    const ttlValue = secondsToUnit(ttl, ttlUnit)

    this.props.change('ttlValue', ttlValue)
    this.props.change('ttlUnit', ttlUnit)
  }

  componentWillReceiveProps(nextProps) {
    const { isCacheable } = nextProps

    if ((typeof this.props.isCacheable !== 'undefined') && (this.props.isCacheable !== isCacheable)) {
      this.props.change('source', sourceDefaultValue)
      this.props.change('ttlValue', DEFAULT_TTL)
      this.props.change('ttlUnit', 'seconds')
      this.props.change('body', '')
    }
  }

  saveChanges(values) {
    const { path, setKey } = this.props
    const { cacheable, ttlValue, ttlUnit, source, body } = values
    const data = { cacheable }

    if (cacheable) {
      data.max_age = secondsFromUnit(ttlValue, ttlUnit)
      data.source = source
      data.body = body
    }
    
    this.props.saveAction(path, setKey, data)
  }

  render() {
    const { isCacheable, handleSubmit, close, invalid } = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.negativeCache.title.text"/></h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Row className="form-group">
              <Col xs={6} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.negativeCache.enableNegativeCache.text"/>
                </ControlLabel>
              </Col>
              <Col xs={6}>
                <Field
                  className="pull-right"
                  name="cacheable"
                  component={FieldFormGroupToggle}
                />
              </Col>
            </Row>

            <hr />

            <Row className="form-group">
              <Col xs={4} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.negativeCache.source.text"/>
                </ControlLabel>
              </Col>
              <Col xs={8}>
                <Field
                  className="pull-right"
                  name="source"
                  component={FieldFormGroupSelect}
                  options={sourceOptions}
                  disabled={!isCacheable}
                />
              </Col>
            </Row>

            <hr />

            <Row className="form-group">
              <Col xs={4}>
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.cache.ttlValue.text"/>
                </ControlLabel>
              </Col>
              <Col xs={4}>
                <Field
                  name="ttlValue"
                  component={FieldFormGroupNumber}
                  min={MIN_TTL}
                  max={MAX_TTL}
                  disabled={!isCacheable}
                />
              </Col>
              <Col xs={4}>
                <Field
                  name="ttlUnit"
                  className="pull-right"
                  component={FieldFormGroupSelect}
                  options={ttlUnitOptions}
                  disabled={!isCacheable}
                />
              </Col>
            </Row>

            <hr />

            <Row className="form-group">
              <Col xs={4}>
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.negativeCache.body.text"/>
                </ControlLabel>
              </Col>
              <Col xs={8}>
                <Field
                  name="body"
                  type="textarea"
                  component={FieldFormGroup}
                  disabled={!isCacheable}
                />
              </Col>
            </Row>

            <FormFooterButtons>
              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid}
              >
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
          </form>
        </Modal.Body>
      </div>
    )
  }
}

NegativeCache.displayName = 'NegativeCache'
NegativeCache.propTypes = {
  close: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  saveAction: React.PropTypes.func,
  set: React.PropTypes.instanceOf(Immutable.Map),
  setKey: React.PropTypes.string,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'negative-cache-form',
  validate
})(NegativeCache)

const cacheFormSelector = formValueSelector('negative-cache-form')

export default connect((state) => ({
  isCacheable: cacheFormSelector(state, 'cacheable')
}))(injectIntl(form))
