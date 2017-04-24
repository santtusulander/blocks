import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { is } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes, SubmissionError } from 'redux-form'
import { Button } from 'react-bootstrap'

import IconAdd from '../shared/icons/icon-add.jsx'
import IsAllowed from '../shared/permission-wrappers/is-allowed'
import HelpTooltip from '../shared/tooltips/help-tooltip'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'
import ConfigurationGTMTrafficRules from './gtm-rules'
import MultilineTextFieldError from '../shared/form-elements/multiline-text-field-error'
import SaveBar from '../shared/page-elements/save-bar'

import RuleModal from './traffic-rule-form/rule-modal'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../shared/form-fields/field-form-group-toggle'
import FieldFormGroupNumber from '../shared/form-fields/field-form-group-number'

import { getById as getProperty } from '../../redux/modules/entities/properties/selectors'
import { formatConfigToInitialValues } from '../../redux/modules/entities/property-GTMs/selectors'
import gtmActions from '../../redux/modules/entities/property-GTMs/actions'
import { getFetchingByTag } from '../../redux/modules/fetching/selectors'

import { parseResponseError } from '../../redux/util'

import { MODIFY_PROPERTY } from '../../constants/permissions'
import { checkForErrors } from '../../util/helpers'
import { isValidCName, isValidTextField } from '../../util/validators.js'
import { GTM_CDN_NAME_MIN_LENGTH, GTM_CDN_NAME_MAX_LENGTH } from '../../constants/gtm'

const validate = ({ GTMToggle, cdnName = '', cName = '', ttl }) => {
  if (!GTMToggle) {
    return {}
  }

  const ttlValue = ttl !== null ? ttl : undefined

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

  return checkForErrors({ cdnName, cName, ttl: ttlValue }, conditions, {
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
  componentWillMount() {
    this.props.property && this.props.fetchGtm(this.props.property.getIn(['services', 0, 'service_type']))
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.property && !is(this.props.property, nextProps.property)) {
      nextProps.fetchGtm(nextProps.property.getIn(['services', 0, 'service_type']))
    }
  }

  generateSubmittableRules(values) {

    const udnPlaceholder = 'UDN'//'{%customer_cname%}'
    const rules = !values.rules
      ? []
      : values.rules.reduce((generatedRules, rule) => {

        const traffic_split_targets = [
          {
            percent: String(100 - rule.policyWeight),
            cname: values.cdnName,
            ttl: String(values.ttl)
          },
          {
            percent: String(rule.policyWeight),
            cname: udnPlaceholder,
            ttl: String(values.ttl)
          }
        ]

        const type = rule.matchArray[0].matchType
        const rulesPerMatch = rule.matchArray[0].values[type].map(({ id }) => {

          return {
            request_match: {
              type,
              value: String(id).toLowerCase()
            },
            traffic_split_targets,
            rule_name: rule.name,
            on_match: 'traffic_split_targets'
          }
        })

        generatedRules.push(...rulesPerMatch)
        return generatedRules
      }, [])

    //Add this rule with 3rd party cname or udn as value based on rest of world-toggle
    rules.push({
      "request_match": { "type": "no_filter", value: '' },
      "on_match": "response_value",
      "response_value": {
        "type": "CNAME",
        "value": values.ROWToggle ? values.cName : udnPlaceholder
      }
    })

    return rules
  }

  submissionError(response) {
    throw new SubmissionError({ _error: parseResponseError(response) })
  }

  toggleModal() {
    this.setState({ ruleModalOpen: !this.state.ruleModalOpen, ruleToEdit: {} })
  }

  editRule(index) {
    this.toggleModal()
    this.setState({ ruleToEdit: { values: this.props.getRule(index), index } })
  }

  onSubmit(values) {

    const propertyServiceType = this.props.property.getIn(['services', 0, 'service_type'])

    if (!values.GTMToggle && this.props.initialValues.GTMToggle) {
      return this.props.deleteGtm(propertyServiceType)
    }

    const propertyId = this.props.property.get('published_host_id')
    const customerId = `${this.props.params.account}-${this.props.params.group}`

    const gtmConfig = {
      rules: this.generateSubmittableRules(values),
      title: values.cName,
      customer_cname: `${propertyId}.${propertyServiceType}.${customerId}.gtm.geocity.cdx-dev.unifieddeliverynetwork.net`,
      policy_name: propertyId,
      customer_id: customerId
    }

    return this.props.initialValues.GTMToggle
      ? this.props.updateGtm(propertyServiceType, gtmConfig)
        .then(() => this.props.showNotification())
        .catch(this.submissionError)

      : this.props.createGtm(propertyServiceType, gtmConfig)
        .then(() => this.props.showNotification())
        .catch(this.submissionError)
  }

  render() {
    const {
      intl,
      error,
      isFormDisabled,
      initialValues,
      readOnly,
      reset,
      invalid,
      submitting,
      handleSubmit,
      isFetching,
      dirty } = this.props

    if (isFetching) {
      return <LoadingSpinner />
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
          </Row>
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.accountManagement.dns.form.ttl.text" />
                </ControlLabel>
              </Col>
              <Col xs={2}>
                {readOnly
                  ? initialValues.ttl
                  : <Field
                    min={0}
                    name="ttl"
                    addonAfter={<FormattedMessage id="portal.units.seconds" />}
                    component={FieldFormGroupNumber}
                    disabled={isFormDisabled}
                  />
                }
              </Col>
            </FormGroup>
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

        <SaveBar
          onCancel={reset}
          invalid={invalid}
          saving={submitting}
          show={(dirty && !!initialValues.GTMToggle) || (!isFormDisabled && !initialValues.GTMToggle)}>
          {error && <span>{error}<br/></span>}
          <FormattedMessage id="portal.configuration.gtm.edit.unsavedChanges.text"/>
        </SaveBar>

      </form>
    )
  }
}

ConfigurationGlobalTrafficManager.displayName = 'ConfigurationGlobalTrafficManager'
ConfigurationGlobalTrafficManager.propTypes = {
  gtmToggleState: PropTypes.bool,
  intl: intlShape.isRequired,
  readOnly: React.PropTypes.bool,
  saveChanges: React.PropTypes.func,
  ...reduxFormPropTypes
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { property }, intl }) => {

  const getFieldValue = formValueSelector('gtmForm')
  const GTMToggle = getFieldValue(state, 'GTMToggle')
  const initialValues = formatConfigToInitialValues(state, property, intl.formatMessage)

  return {
    isFetching: getFetchingByTag(state, 'properties') || getFetchingByTag(state, 'gtm'),
    isFormDisabled: !GTMToggle,
    getRule: (index) => getFieldValue(state, 'rules')[index],
    property: getProperty(state, property),
    initialValues: { ttl: 60, ...initialValues }
  }
}

const dispatchToProps = (dispatch, { params }) => {
  return {
    fetchGtm: service => dispatch(gtmActions.fetchOne({ ...params, service })),
    updateGtm: (service, payload) => dispatch(gtmActions.update({ ...params, service, payload })),
    deleteGtm: service => dispatch(gtmActions.remove({ ...params, service })),
    createGtm: (service, payload) => dispatch(gtmActions.create({ ...params, service, payload }))
  }
}

const GTMForm = reduxForm({
  form: 'gtmForm',
  enableReinitialize: true,
  validate
})(ConfigurationGlobalTrafficManager)

export default injectIntl(connect(mapStateToProps, dispatchToProps)(GTMForm))
