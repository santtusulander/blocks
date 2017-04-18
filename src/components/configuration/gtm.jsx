import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { Map, is } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'

import IconAdd from '../shared/icons/icon-add.jsx'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import HelpTooltip from '../shared/tooltips/help-tooltip'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'
import ConfigurationGTMTrafficRules from './gtm-rules'
import MultilineTextFieldError from '../shared/form-elements/multiline-text-field-error'

import RuleModal from './traffic-rule-form/rule-modal'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../shared/form-fields/field-form-group-toggle'

import { getById as getProperty } from '../../redux/modules/entities/properties/selectors'
import { formatConfigToInitialValues } from '../../redux/modules/entities/property-GTMs/selectors'
import gtmActions from '../../redux/modules/entities/property-GTMs/actions'

import { MODIFY_PROPERTY } from '../../constants/permissions'
import { checkForErrors } from '../../util/helpers'
import { isValidCName, isValidTextField } from '../../util/validators.js'
import { GTM_CDN_NAME_MIN_LENGTH, GTM_CDN_NAME_MAX_LENGTH } from '../../constants/gtm'

const validate = ({ GTMToggle, cdnName, cName }) => {
  if (!GTMToggle) {
    return {}
  }

  const conditions = {
    cdnName: {
      condition: !isValidTextField(cdnName, GTM_CDN_NAME_MIN_LENGTH, GTM_CDN_NAME_MAX_LENGTH),
      errorText: <MultilineTextFieldError
                    fieldLabel="portal.configuration.gtm.trafficConfig.cdnName.label"
                    minValue={GTM_CDN_NAME_MIN_LENGTH}
                    maxValue={GTM_CDN_NAME_MAX_LENGTH}
                  />
    },
    cName: {
      condition: !isValidCName(cName),
      errorText: <FormattedMessage id="portal.configuration.gtm.trafficConfig.cName.validation.text" />
    }
  }

  return checkForErrors({ cdnName, cName }, conditions, {
    cdnName: <FormattedMessage id="portal.configuration.gtm.trafficConfig.cdnName.required"/>,
    cName: <FormattedMessage id="portal.configuration.gtm.trafficConfig.cName.required"/>
  })
}

class ConfigurationGlobalTrafficManager extends React.Component {
  constructor(props) {
    super(props)

    this.editRule = this.editRule.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state = { ruleToEdit: {}, ruleModalOpen: false }
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.property, nextProps.property)) {
      this.props.fetchGtm(nextProps.property.getIn(['services', 0, 'service_type']))
    }
  }

  toggleModal() {
    this.setState({ ruleModalOpen: !this.state.ruleModalOpen, ruleToEdit: {} })
  }

  editRule(index) {
    this.toggleModal()
    this.setState({ ruleToEdit: { values: this.props.getRule(index), index } })
  }

  onSubmit(values) {

    const rules = values.rules.reduce((generatedRules, rule) => {

      const traffic_split_targets = [
        {
          percent: String(100 - rule.policyWeight),
          cname: values.cName
        },
        {
          percent: String(rule.policyWeight),
          cname: '{%customer_cname%}'
        }
      ]

      const type = rule.matchArray[0].matchType
      const rulesPerMatch = rule.matchArray[0].values[type].map(match => ({
        request_match: {
          type,
          value: (match.id || match.value).toLowerCase()
        },
        traffic_split_targets,
        rule_name: rule.name,
        on_match: 'traffic_split_targets'
      }))

      generatedRules.push(...rulesPerMatch)
      return generatedRules
    },[])

    //Add this rule with 3rd party cname or udn as value based on rest of world-toggle
    rules.push({
      "request_match": { "type": "no_filter" },
      "on_match": "response_value",
      "response_value": {
        "type": "CNAME",
        "value": values.ROWToggle ? values.cName : '{%customer_cname%}'
      }
    })

    const gtmConfig = {
      rules,
      title: values.cName,
      //TODO replace with something
      customer_cname: 'creativegames.com.large.238-339.gtm.geocity.cdx-dev.unifieddeliverynetwork.net',
      //TODO replace with something
      policy_name: 'creativegames.com',
      customer_id: '238-339'
    }

    console.log(gtmConfig, values);
  }

  render() {
    const { config, intl, isFormDisabled, initialValues, readOnly, handleSubmit } = this.props
    if (!config || !config.size) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <form className="configuration-gtm" onSubmit={handleSubmit(this.onSubmit)}>
        {this.state.ruleModalOpen && <RuleModal rule={this.state.ruleToEdit} onCancel={this.toggleModal}/>}
        {/* ENABLE GTM */}
        <SectionContainer>
          <Row>
            {readOnly ?
              (
                <FormGroup>
                  <ControlLabel className="help-icon">
                    <Col xs={12}>
                      <FormattedMessage id="portal.configuration.gtm.gtmToggle.readOnly.text" values={{
                        status: <span className="gtm-toggle-status">
                                {
                                  initialValues.GTMToggle ?
                                  <FormattedMessage id="portal.configuration.gtm.gtmToggle.readOnly.enabled.text" /> :
                                  <FormattedMessage id="portal.configuration.gtm.gtmToggle.readOnly.disabled.text" />
                                }
                                </span>
                      }} />
                      <HelpTooltip
                        id='gtm-tooltip'
                        title={<FormattedMessage id="portal.configuration.gtm.gtmToggle.label"/>}>
                        <FormattedMessage id="portal.configuration.gtm.gtmToggle.help" />
                      </HelpTooltip>
                    </Col>
                  </ControlLabel>
                </FormGroup>
              )
            :
              (
                <FormGroup>
                  <Col xs={3}>
                    <ControlLabel className="help-icon">
                      <FormattedMessage id="portal.configuration.gtm.gtmToggle.label"/>
                      <HelpTooltip
                        id='gtm-tooltip'
                        title={<FormattedMessage id="portal.configuration.gtm.gtmToggle.label"/>}>
                        <FormattedMessage id="portal.configuration.gtm.gtmToggle.help" />
                      </HelpTooltip>
                    </ControlLabel>
                  </Col>
                  <Col xs={9}>
                    <Field
                      name="GTMToggle"
                      component={FieldFormGroupToggle}
                      required={true}
                    />
                  </Col>
                </FormGroup>
              )
            }
          </Row>
        </SectionContainer>

        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.configuration.gtm.trafficConfig.label"/>} />
        <hr />

        {/* TRAFFIC CONFIGURATION */}
        <SectionContainer className="traffic-config">
          <Row>

            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.cdnName.label"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                {readOnly ?
                  initialValues.cdnName
                :
                  <Field
                    name="cdnName"
                    placeholder={intl.formatMessage({id: 'portal.configuration.gtm.trafficConfig.cdnName.placeholder'})}
                    component={FieldFormGroup}
                    disabled={isFormDisabled}
                  />
                }
              </Col>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.cName.label"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                {readOnly ?
                  initialValues.cName
                :
                  <Field
                    name="cName"
                    placeholder={intl.formatMessage({id: 'portal.configuration.gtm.trafficConfig.cName.placeholder'})}
                    component={FieldFormGroup}
                    disabled={isFormDisabled}
                  />
                }
              </Col>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel className="help-icon">
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.ROW.label"/>
                  <HelpTooltip
                    id='row-tooltip'
                    title={<FormattedMessage id="portal.configuration.gtm.trafficConfig.ROW.label"/>}>
                    <FormattedMessage id="portal.configuration.gtm.trafficConfig.ROW.help" />
                  </HelpTooltip>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                {readOnly ?
                  initialValues.ROWToggle ?
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.ROW.readOnly.enabled.text" /> :
                  <FormattedMessage id="portal.configuration.gtm.trafficConfig.ROW.readOnly.disabled.text" />
                :
                  <Field
                    name="ROWToggle"
                    component={FieldFormGroupToggle}
                    readonly={isFormDisabled}
                  />
                }
              </Col>
            </FormGroup>
            <Button type="submit">asdasdads</Button>
          </Row>
        </SectionContainer>

        {/* TRAFFIC RULES */}
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.configuration.gtm.table.label"/>}>
          {!readOnly &&
            <IsAllowed to={MODIFY_PROPERTY}>
              <Button bsStyle="success" className="btn-icon" onClick={this.toggleModal} disabled={isFormDisabled}>
                <IconAdd />
              </Button>
            </IsAllowed>
          }
        </SectionHeader>

        <SectionContainer>
          <ConfigurationGTMTrafficRules
            readOnly={isFormDisabled || readOnly}
            editRule={this.editRule}
            deleteRule={this.deleteRule}
          />
        </SectionContainer>
      </form>
    )
  }
}

ConfigurationGlobalTrafficManager.displayName = 'ConfigurationGlobalTrafficManager'
ConfigurationGlobalTrafficManager.propTypes = {
  config: PropTypes.instanceOf(Map),
  gtmToggleState: PropTypes.bool,
  intl: intlShape.isRequired,
  readOnly: React.PropTypes.bool,
  saveChanges: React.PropTypes.func,
  ...reduxFormPropTypes
}

ConfigurationGlobalTrafficManager.defaultProps = {
  config: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { property } }) => {
  const selector = formValueSelector('gtmForm')
  const GTMToggle = selector(state, 'GTMToggle')
  const initialValues = formatConfigToInitialValues(state, property)
  /*
    TODO: UDNP-3108 - Integrate Global Traffic form with Redux

    Please note - we should use existing approach of saving configuration
                  like in other Configuragion tabs.
  */
  return {
    isFormDisabled: !GTMToggle,
    getRule: (index) => selector(state, 'rules')[index],
    property: getProperty(state, property),
    initialValues
  }
}

const dispatchToProps = (dispatch, { params }) => {
  return {
    fetchGtm: service => dispatch(gtmActions.fetchOne({ ...params, service }))
  }
}

const GTMForm = reduxForm({
  form: 'gtmForm',
  validate
})(injectIntl(ConfigurationGlobalTrafficManager))

export default connect(mapStateToProps, dispatchToProps)(GTMForm)
