import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'

import IconAdd from '../icons/icon-add.jsx'
import IsAllowed from '../is-allowed'
import HelpTooltip from '../help-tooltip'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import ConfigurationGTMTrafficRules from './gtm-rules'
import MultilineTextFieldError from '../shared/forms/multiline-text-field-error'

import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupToggle from '../form/field-form-group-toggle'

import { MODIFY_PROPERTY } from '../../constants/permissions'
import { checkForErrors } from '../../util/helpers'
import { isValidCName, isValidTextField } from '../../util/validators.js'

const validate = ({ cdnName, cName }) => {
  const conditions = {
    cdnName: {
      condition: !isValidTextField(cdnName),
      errorText: <MultilineTextFieldError fieldLabel="portal.configuration.gtm.trafficConfig.cdnName.label" />
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

    this.addRule = this.addRule.bind(this)
    this.editRule = this.editRule.bind(this)
    this.deleteRule = this.deleteRule.bind(this)
  }

  addRule() {
    /*
      TODO: UDNP-3088 - Rules section
    */
  }

  editRule() {
    /*
      TODO: UDNP-3088 - Rules section
    */
  }

  deleteRule() {
    /*
      TODO: UDNP-3088 - Rules section
    */
  }

  render() {
    const { config, intl, isFormDisabled, initialValues, readOnly } = this.props

    if (!config || !config.size) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <div className="configuration-gtm">

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
        </SectionContainer>

        {/* TRAFFIC RULES */}
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.configuration.gtm.table.label"/>}>
          {!readOnly &&
            <IsAllowed to={MODIFY_PROPERTY}>
              <Button bsStyle="success" className="btn-icon" onClick={this.addRule} disabled={isFormDisabled}>
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
      </div>
    )
  }
}

ConfigurationGlobalTrafficManager.displayName = 'ConfigurationGlobalTrafficManager'
ConfigurationGlobalTrafficManager.propTypes = {
  config: PropTypes.instanceOf(Map),
  gtmToggleState: PropTypes.bool,
  intl: intlShape.isRequired,
  readOnly: React.PropTypes.bool,
  ...reduxFormPropTypes
}

ConfigurationGlobalTrafficManager.defaultProps = {
  config: Map()
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('gtmForm')
  const GTMToggle = selector(state, 'GTMToggle')

  /*
    TODO: UDNP-3088 - Rules section
  */
  return {
    isFormDisabled: !GTMToggle,
    initialValues: {
      GTMToggle: true,
      cdnName: 'google.com',
      cName: 'google',
      ROWToggle: true
    }
  }
}

const form = reduxForm({
  form: 'gtmForm',
  validate
})(injectIntl(ConfigurationGlobalTrafficManager))

export default connect(mapStateToProps)(form)
