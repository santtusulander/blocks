import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { Map, is } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { reduxForm, formValueSelector, Field, propTypes as reduxFormPropTypes } from 'redux-form'

import { Button } from 'react-bootstrap'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupCheckbox from '../shared/form-fields/field-form-group-checkbox'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'
import SaveBar from '../shared/page-elements/save-bar'

import metadataActions from '../../redux/modules/entities/metadata/actions'
import { getById as getMetadata } from '../../redux/modules/entities/metadata/selectors'

import propertiesActions from '../../redux/modules/entities/properties/actions'
import { getById as getPropertyById } from '../../redux/modules/entities/properties/selectors'

import { buildReduxId } from '../../redux/util'

const getServiceType = (property) => {
  return property && property.getIn(['services', 0, 'service_type'])
}

/* Field Names */
const FIELD_REQUEST = 'custom_request_policy_xml'
const FIELD_RESPONSE = 'custom_response_policy_xml'
const FIELD_FINAL_REQUEST = 'custom_final_request_policy_xml'
const FIELD_FINAL_RESPONSE = 'custom_final_response_policy_xml'

const FIELD_USE_REQUEST = 'use_custom_request_policy_xml'
const FIELD_USE_RESPONSE = 'use_custom_response_policy_xml'
const FIELD_USE_FINAL_REQUEST = 'use_custom_final_request_policy_xml'
const FIELD_USE_FINAL_RESPONSE = 'use_custom_final_response_policy_xml'

const FIELD_AUTOGENERATED_REQUEST = 'request_policy_xml'
const FIELD_AUTOGENERATED_RESPONSE = 'response_policy_xml'
const FIELD_AUTOGENERATED_FINAL_REQUEST = 'final_request_policy_xml'
const FIELD_AUTOGENERATED_FINAL_RESPONSE = 'final_response_policy_xml'


class ConfigurationAdvanced extends React.Component {
  constructor(props) {
    super(props)

    this.restoreConfig = this.restoreConfig.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentWillMount() {
    const {brand, account, group, property} = this.props.params

    if (this.props.property) {
      this.fetchMetadata(this.props)
    } else {
      this.props.fetchProperty({brand, account, group, id: property})
    }
  }

  componentWillReceiveProps(nextProps) {

    //If property Changed, fetch metadata
    if (!is(this.props.property, nextProps.property)) {
      this.fetchMetadata(nextProps)
    }

  }

  fetchMetadata(props) {
    const {brand, account, group, property} = props.params
    const serviceType = getServiceType(props.property)

    props.fetchMetadata({brand, account, group, property, serviceType, forceReload: true})
  }

  onSubmit(edit, values) {
    const {brand, account, group, property} = this.props.params

    if (edit) {
      this.props.updateMetadata({brand, account, group, property, serviceType: getServiceType(this.props.property), payload: values})
    } else {
      this.props.createMetadata({brand, account, group, property, serviceType: getServiceType(this.props.property), payload: values})
    }
  }

  restoreConfig(configName) {
    switch (configName) {
      case FIELD_REQUEST:
        this.props.change(FIELD_REQUEST, this.props.initialValues[FIELD_AUTOGENERATED_REQUEST])
        break;

      case FIELD_RESPONSE:
        this.props.change(FIELD_RESPONSE, this.props.initialValues[FIELD_AUTOGENERATED_RESPONSE])
        break;

      case FIELD_FINAL_REQUEST:
        this.props.change(FIELD_FINAL_REQUEST, this.props.initialValues[FIELD_AUTOGENERATED_FINAL_REQUEST])
        break;

      case FIELD_FINAL_RESPONSE:
        this.props.change(FIELD_FINAL_RESPONSE, this.props.initialValues[FIELD_AUTOGENERATED_FINAL_RESPONSE])
        break;
    }
  }

  render() {
    const {
      advancedTabReadOnly,
      metadata,
      invalid,
      dirty,
      submitting,
      intl,
      isRequestEnabled,
      isResponseEnabled,
      isFinalRequestEnabled,
      isFinalResponseEnabled,
      handleSubmit,
      edit,
      reset
    } = this.props

    if (!metadata || metadata.isEmpty()) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <form className="configuration-advanced" onSubmit={handleSubmit(values => this.onSubmit(edit, values))}>

        {/* Override Request Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.requestPolicies.label"/>}
          addonBefore={
            <Field
              name={FIELD_USE_REQUEST}
              component={FieldFormGroupCheckbox}
              disabled={advancedTabReadOnly}
            />
          }
        />

        {isRequestEnabled &&
          <SectionContainer className="request-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FIELD_REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isRequestEnabled || advancedTabReadOnly}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_REQUEST)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isRequestEnabled) || advancedTabReadOnly}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }
        <hr />

        {/* Override Response Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.responsePolicies.label"/>}
          addonBefore={
            <Field
              name={FIELD_USE_RESPONSE}
              component={FieldFormGroupCheckbox}
              disabled={advancedTabReadOnly}
            />
          }
        />

        {isResponseEnabled &&
          <SectionContainer className="response-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FIELD_RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isResponseEnabled || advancedTabReadOnly}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_RESPONSE)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isResponseEnabled) || advancedTabReadOnly}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }
        <hr />

        {/* Override Final Request Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.finalRequestPolicies.label"/>}
          addonBefore={
            <Field
              name={FIELD_USE_FINAL_REQUEST}
              component={FieldFormGroupCheckbox}
              disabled={advancedTabReadOnly}
            />
          }
        />

        {isFinalRequestEnabled &&
          <SectionContainer className="final-request-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FIELD_FINAL_REQUEST}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalRequestEnabled || advancedTabReadOnly}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_FINAL_REQUEST)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isFinalRequestEnabled) || advancedTabReadOnly}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }
        <hr />

        {/* Override Final Response Policies */}
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.configuration.advanced.finalResponsePolicies.label"/>}
          addonBefore={
            <Field
              name={FIELD_USE_FINAL_RESPONSE}
              component={FieldFormGroupCheckbox}
              disabled={advancedTabReadOnly}
            />
          }
        />

        {isFinalResponseEnabled &&
          <SectionContainer className="final-response-config">
            <Row>
              <FormGroup>
                <Col xs={4}>
                  <Field
                    name={FIELD_FINAL_RESPONSE}
                    type="textarea"
                    placeholder={intl.formatMessage({id: 'portal.configuration.advanced.text.placeholder'})}
                    component={FieldFormGroup}
                    disabled={!isFinalResponseEnabled || advancedTabReadOnly}
                  />
                </Col>
                <Col xs={1}>
                  <Button
                    onClick={() => this.restoreConfig(FIELD_FINAL_RESPONSE)}
                    bsStyle="primary"
                    disabled={invalid || submitting || (!isFinalResponseEnabled) || advancedTabReadOnly}>
                    <FormattedMessage id="portal.configuration.advanced.restore.button.label"/>
                  </Button>
                </Col>
              </FormGroup>
            </Row>
          </SectionContainer>
        }
        <hr />

        {!advancedTabReadOnly &&
          <SaveBar
            onCancel={reset}
            invalid={invalid}
            saving={submitting}
            show={dirty}>
            <FormattedMessage id="portal.configuration.advanced.edit.unsavedChanges.text"/>
          </SaveBar>
        }

      </form>
    )
  }
}

ConfigurationAdvanced.displayName = 'ConfigurationAdvanced'
ConfigurationAdvanced.propTypes = {
  advancedTabReadOnly: PropTypes.bool,
  config: PropTypes.instanceOf(Map),
  intl: intlShape.isRequired,
  isFinalRequestEnabled: PropTypes.bool,
  isFinalResponseEnabled: PropTypes.bool,
  isRequestEnabled: PropTypes.bool,
  isResponseEnabled: PropTypes.bool,
  ...reduxFormPropTypes
}

ConfigurationAdvanced.defaultProps = {
  config: Map(),
  metadata: Map(),
  property: Map(),
  customPolicyConfig: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {

  const selector = formValueSelector('advancedForm')

  const requestCheckbox = selector(state, FIELD_USE_REQUEST)
  const responseCheckbox = selector(state, FIELD_USE_RESPONSE)
  const finalRequestCheckbox = selector(state, FIELD_USE_FINAL_REQUEST)
  const finalResponseCheckbox = selector(state, FIELD_USE_FINAL_RESPONSE)

  const property = getPropertyById(state, ownProps.params.property)
  const metadata = property && getMetadata(state, buildReduxId(property.get('published_host_id'), getServiceType(property)))
  const customPolicyConfig = metadata && metadata.get('customPolicyConfig')
  const initialValues = customPolicyConfig && customPolicyConfig.toJS()

  //if initialValues has values => set edit
  const edit = initialValues && (
    initialValues[FIELD_REQUEST] !== '' ||
    initialValues[FIELD_RESPONSE] !== '' ||
    initialValues[FIELD_FINAL_REQUEST] !== '' ||
    initialValues[FIELD_FINAL_RESPONSE] !== ''
  )

  if (initialValues) {
    //if fields are empty, populate from autogenerated values
    if (initialValues[FIELD_REQUEST] === '') {
      initialValues[FIELD_REQUEST] = initialValues[FIELD_AUTOGENERATED_REQUEST]
    }

    if (initialValues[FIELD_RESPONSE] === '') {
      initialValues[FIELD_RESPONSE] = initialValues[FIELD_AUTOGENERATED_RESPONSE]
    }

    if (initialValues[FIELD_FINAL_REQUEST] === '') {
      initialValues[FIELD_FINAL_REQUEST] = initialValues[FIELD_AUTOGENERATED_FINAL_REQUEST]
    }

    if (initialValues[FIELD_FINAL_RESPONSE] === '') {
      initialValues[FIELD_FINAL_RESPONSE] = initialValues[FIELD_AUTOGENERATED_FINAL_RESPONSE]
    }

  }

  return {
    property,
    metadata,
    isRequestEnabled: requestCheckbox,
    isResponseEnabled: responseCheckbox,
    isFinalRequestEnabled: finalRequestCheckbox,
    isFinalResponseEnabled: finalResponseCheckbox,
    edit,

    initialValues
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperty: (params) => dispatch(propertiesActions.fetchOne(params)) ,

    fetchMetadata: (params) => dispatch(metadataActions.fetchAll(params)),
    createMetadata: (params) => dispatch(metadataActions.create(params)),
    updateMetadata: (params) => dispatch(metadataActions.update(params)),
    removeMetadata: (params) => dispatch(metadataActions.remove(params))
  }
}

const form = reduxForm({
  form: 'advancedForm',
  enableReinitialize: true
})(injectIntl(ConfigurationAdvanced))

export default connect(mapStateToProps, mapDispatchToProps)(form)
