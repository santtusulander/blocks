import React from 'react'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'

import FieldFormGroupNumber from '../form/field-form-group-number'
import FieldFormGroupToggle from '../form/field-form-group-toggle'
import FieldFormGroupSelect from '../form/field-form-group-select'
import CacheKeyQueryStringForm from './actions/cache-key-query-string-form'
import { secondsToUnit, secondsFromUnit, unitFromSeconds } from './helpers'

class ConfigurationDefaults extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleTtlValueChange = this.handleTtlValueChange.bind(this)
    this.handleTtlUnitChange = this.handleTtlUnitChange.bind(this)
    this.updateCacheKeyQueryString = this.updateCacheKeyQueryString.bind(this)
  }

  componentWillMount() {
    const { config, change } = this.props 

    change('allow_cookies', config.getIn(['edge_configuration', 'allow_cookies'], false))
    change('response_remove_vary', config.getIn(['defaults', 'response_remove_vary'], false))
    change('cache_name_ignore_case', config.getIn(['defaults', 'cache_name_ignore_case'], false))
    change('cache_control_check_etag', config.getIn(['defaults', 'cache_control_check_etag'], 'false'))
    change('cache_control_honor_origin', config.getIn(['defaults', 'cache_control_honor_origin'], false))
    change('cache_control_max_age', config.getIn(['defaults', 'cache_control_max_age'], 0))

    const ttl = config.getIn(['defaults', 'cache_control_max_age'], 0)
    const ttlUnit = unitFromSeconds(ttl)
    const ttlValue = secondsToUnit(ttl, ttlUnit)

    this.props.change('ttlValue', ttlValue)
    this.props.change('ttlUnit', ttlUnit)
  }

  handleChange(path) {
    return (e, value) => {
      this.props.changeValue(path, value)
    }
  }

  handleTtlValueChange() {
    return (e, ttlValue) => {
      const value = secondsFromUnit(ttlValue, this.props.ttlUnit)

      this.props.changeValue(['defaults','cache_control_max_age'], value)
    }
  }

  handleTtlUnitChange() {
    return (e, ttlUnit) => {
      const value = secondsFromUnit(this.props.ttlValue, ttlUnit)

      this.props.changeValue(['defaults','cache_control_max_age'], value)
    }
  }

  updateCacheKeyQueryString(set) {
    this.props.changeValue(['defaults','cache_key_query'], set.get('name'))
  }

  render() {
    const { config, intl, readOnly } = this.props
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

    if (!config || !config.size) {
      return (
        <div className="container"><FormattedMessage id="portal.loading.text"/></div>
      )
    }

    return (
      <div className="configuration-defaults">
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.defaults.originCacheControl.text"/>} />
        <SectionContainer>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.allowCookies.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Field
              name="allow_cookies"
              component={FieldFormGroupToggle}
              onChange={this.handleChange(['edge_configuration','allow_cookies'])}
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.removeVaryHeader.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Field
              name="response_remove_vary"
              component={FieldFormGroupToggle}
              onChange={this.handleChange(['defaults','response_remove_vary'])}
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.ignoreOriginCase.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Field
              name="cache_name_ignore_case"
              component={FieldFormGroupToggle}
              onChange={this.handleChange(['defaults','cache_name_ignore_case'])}
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.enableEtag.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Field
              name="cache_control_check_etag"
              component={FieldFormGroupSelect}
              options={cacheControlEtagOptions}
              onChange={this.handleChange(['defaults','cache_control_check_etag'])}
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.honorOriginCacheControl.text"/>
          </Col>
          <Col lg={8} xs={6}>
            <Field
              name="cache_control_honor_origin"
              component={FieldFormGroupToggle}
              onChange={this.handleChange(['defaults','cache_control_honor_origin'])}
            />
          </Col>
        </Row>


        <Row className="form-group">
          <Col lg={4} xs={6} className="toggle-label">
            <FormattedMessage id="portal.policy.edit.defaults.ttlIfNotPresent.text"/>
          </Col>
          <Col lg={2} xs={3}>
            <Field
              name="ttlValue"
              component={FieldFormGroupNumber}
              onChange={this.handleTtlValueChange()}
              min={0}
            />
          </Col>
          <Col xs={3}>
            <Field
              name="ttlUnit"
              component={FieldFormGroupSelect}
              options={ttlUnitOptions}
              onChange={this.handleTtlUnitChange()}
            />
          </Col>
        </Row>
      </SectionContainer>

      <SectionHeader
        sectionHeaderTitle={<FormattedMessage id="portal.policy.edit.defaults.cacheKeyQueryString.text"/>} />
      <SectionContainer>
        <CacheKeyQueryStringForm
          disabled={readOnly}
          horizontal={true}
          intl={intl}
          set={Immutable.Map({name: config.getIn(['defaults','cache_key_query'])})}
          updateSet={this.updateCacheKeyQueryString}/>
      </SectionContainer>
    </div>
    )
  }
}

ConfigurationDefaults.displayName = 'ConfigurationDefaults'
ConfigurationDefaults.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object,
  readOnly: React.PropTypes.bool,
  ...reduxFormPropTypes
}
ConfigurationDefaults.defaultProps = {
  config: Immutable.Map(),
  ttlValue: 0,
  ttlUnit: 'seconds'
}

const form = reduxForm({
  form: 'configuration-defaults-form'
})(ConfigurationDefaults)

const selector = formValueSelector('configuration-defaults-form')

export default connect(state => {
  const ttl = selector(state, 'cache_control_max_age')
  const ttlUnit = unitFromSeconds(ttl)

  return {
    ttlValue: secondsToUnit(ttl, ttlUnit),
    ttlUnit: ttlUnit
  }
})(injectIntl(form))
