import React from 'react'
import { Button, Col, ControlLabel, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import FieldFormGroupNumber from '../../shared/form-fields/field-form-group-number'
import FieldFormGroupToggle from '../../shared/form-fields/field-form-group-toggle'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

import { secondsToUnit, unitFromSeconds, secondsFromUnit } from '../helpers'

const cacheControlEtagOptions = [
  { value: 'strong', label: <FormattedMessage id="portal.policy.edit.defaults.enableEtagStrong.text"/>},
  { value: 'weak', label: <FormattedMessage id="portal.policy.edit.defaults.enableEtagWeak.text"/>},
  { value: 'false', label: <FormattedMessage id="portal.policy.edit.defaults.enableEtagFalse.text"/>}
]
const ttlUnitOptions = [
  {value: 'seconds', label: <FormattedMessage id="portal.units.seconds"/>},
  {value: 'minutes', label: <FormattedMessage id="portal.units.minutes"/>},
  {value: 'hours', label: <FormattedMessage id="portal.units.hours"/>},
  {value: 'days', label: <FormattedMessage id="portal.units.days"/>}
]

class Cache extends React.Component {
  constructor(props) {
    super(props)

    this.updateProps = this.updateProps.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    this.updateProps(this.props.set)
  }

  componentWillReceiveProps(nextProps) {
    const { set } = nextProps

    if (this.props.set !== set) {
      this.updateProps(set)
    }
  }

  updateProps(set) {
    this.props.change('noStore', set.get('no_store', false))
    this.props.change('checkEtag', set.get('check_etag', 'false'))
    this.props.change('honorOrigin', set.get('honor_origin', false))

    const ttl = set.get('max_age', 0)
    const ttlUnit = unitFromSeconds(ttl)
    const ttlValue = secondsToUnit(ttl, ttlUnit)

    this.props.change('ttlValue', ttlValue)
    this.props.change('ttlUnit', ttlUnit)
  }

  saveChanges(values) {
    const { noStore, checkEtag, honorOrigin, ttlValue, ttlUnit } = values

    this.props.saveAction(this.props.path, this.props.setKey, {
      check_etag: checkEtag,
      max_age: secondsFromUnit(ttlValue, ttlUnit),
      no_store: noStore,
      honor_origin: honorOrigin
    })
  }

  render() {
    const { disabled, handleSubmit, close } = this.props
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.cache.cache.text"/></h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>

            <Row className="form-group">
              <Col lg={4} xs={6} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.cache.noStore.text"/>
                </ControlLabel>
              </Col>
              <Col lg={8} xs={6}>
                <Field
                  name="noStore"
                  component={FieldFormGroupToggle}
                />
              </Col>
            </Row>

            <hr />

            <Row className="form-group">
              <Col lg={4} xs={6} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.cache.honorCacheControl.text"/>
                </ControlLabel>
              </Col>
              <Col lg={8} xs={6}>
                <Field
                  name="honorOrigin"
                  component={FieldFormGroupToggle}
                  readonly={disabled}
                />
              </Col>
            </Row>

            <hr />

            <Row className="form-group">
              <Col lg={4} xs={6} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.cache.honorEtag.text"/>
                </ControlLabel>
              </Col>
              <Col lg={8} xs={6}>
                <Field
                  name="checkEtag"
                  component={FieldFormGroupSelect}
                  options={cacheControlEtagOptions}
                  disabled={disabled}
                />
              </Col>
            </Row>
            
            <hr/>

            <Row className="form-group">
              <Col lg={4} xs={6} className="toggle-label">
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.cache.ttlValue.text"/>
                </ControlLabel>
              </Col>
              <Col lg={2} xs={3}>
                <Field
                  name="ttlValue"
                  component={FieldFormGroupNumber}
                  min={0}
                  disabled={disabled}
                />
              </Col>
              <Col xs={3}>
                <Field
                  name="ttlUnit"
                  component={FieldFormGroupSelect}
                  options={ttlUnitOptions}
                  disabled={disabled}
                />
              </Col>
            </Row>

            <FormFooterButtons>
              <Button
                className="btn-secondary"
                onClick={close}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>
              <Button
                type="submit"
                bsStyle="primary"
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

Cache.displayName = 'Cache'
Cache.propTypes = {
  close: React.PropTypes.func,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  saveAction: React.PropTypes.func,
  set: React.PropTypes.instanceOf(Immutable.Map),
  setKey: React.PropTypes.string,
  ...reduxFormPropTypes
}

const cacheFormSelector = formValueSelector('cache-form')

const mapStateToProps = (state) => (
  {
    disabled: cacheFormSelector(state, 'no_store')
  }
)

const form = reduxForm({
  form: 'cache-form'
})(Cache)

export default connect(mapStateToProps)(injectIntl(form))
