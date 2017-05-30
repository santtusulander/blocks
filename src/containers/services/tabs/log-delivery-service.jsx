import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import { Row, Col, FormGroup, InputGroup, Button } from 'react-bootstrap'

import { Map, is } from 'immutable'

import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getIdsByGroup as getPropertiesByGroup } from '../../../redux/modules/entities/properties/selectors'
import propertiesActions from '../../../redux/modules/entities/properties/actions'
import propertiesLogsActions from '../../../redux/modules/entities/properties-logs/actions'
import { getById as getLogsByPropId } from '../../../redux/modules/entities/properties-logs/selectors'
import { changeNotification } from '../../../redux/modules/ui'

import SidePanel from '../../../components/shared/side-panel'
import ComparisonBars from '../../../components/shared/comparison-bars'
import IconConfiguration from '../../../components/shared/icons/icon-configuration'
import Select from '../../../components/shared/form-elements/select'

import LogDeliveryConfigureForm from '../../../components/services/log-delivery-configure-form'

class LogDeliveryService extends React.Component {
  constructor(props) {
    super(props)

    this.toggleModal = this.toggleModal.bind(this)
    this.editPropertyConfig = this.editPropertyConfig.bind(this)
    this.savePropertyLogsConfig = this.savePropertyLogsConfig.bind(this)
    this.changeCurrentProperty = this.changeCurrentProperty.bind(this)
    this.showNotification = this.showNotification.bind(this)

    this.state = {
      currentProperty: null,
      propertyLogsConfig: Map(),
      showModal: false
    }
  }

  componentWillMount() {
    this.props.params.group && this.props.fetchProperties(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentProperty !== nextProps.currentProperty) {
      this.setState({
        currentProperty: nextProps.currentProperty
      })
    }

    if (!is(this.props.activeGroup, nextProps.activeGroup) && this.props.params.group) {
      this.props.fetchProperties(this.props.params)
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  editPropertyConfig() {
    const {brand, account, group} = this.props.params
    this.props.getPropertyLogsConfig({brand, account, group, host: this.state.currentProperty})
      .then(() => {
        const config = getLogsByPropId(this.props.appState, this.state.currentProperty) || Map()
        this.setState({propertyLogsConfig: config})
        this.toggleModal()
      })
  }

  savePropertyLogsConfig(config) {
    const {brand, account, group} = this.props.params
    const params = {brand, account, group, host: this.state.currentProperty, payload: config}

    if (this.state.propertyLogsConfig.size) {
      this.props.updatePropertyLogsConfig(params)
        .then(() => {
          this.showNotification(<FormattedMessage id="portal.services.logDelivery.updateConfig.success.text" />)
        })
        .catch (() => {
          this.showNotification(<FormattedMessage id="portal.services.logDelivery.updateConfig.fail.text"/>)
        })
    } else {
      this.props.createPropertyLogsConfig(params)
        .then(() => {
          this.showNotification(<FormattedMessage id="portal.services.logDelivery.createConfig.success.text" />)
        })
        .catch (() => {
          this.showNotification(<FormattedMessage id="portal.services.logDelivery.createConfig.fail.text"/>)
        })
    }

    this.toggleModal()
  }

  changeCurrentProperty(value) {
    this.setState({
      currentProperty: value
    })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 5000)
  }

  render() {

    const sorterCallback = (a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()

      if (aLower < bLower) {
        return -1
      }
      if (aLower > bLower) {
        return 1
      }
      return 0
    }

    const propertiesOptions = this.props.properties.toJS()
      .sort(sorterCallback)
      .map((host) => ({label: host, value: host}))

    const { currentProperty, showModal, propertyLogsConfig } = this.state

    const storage = { //TODO mock
      current: 100,
      estimate: 500,
      unit: 'Gb'
    }

    return (
      !this.props.params.group
      ?
        <p className='text-center'>
          <FormattedMessage id='portal.services.logDelivery.selectGroup.text' />
        </p>
      :
        <div className="log-delivery-service">
          <Row>
            <FormGroup>
              <Col xs={3}>
                <h5>
                  <FormattedMessage id="portal.services.logDelivery.properties.text"/>
                </h5>
                <InputGroup>
                  <Select
                    className="input-select"
                    ref="taras"
                    value={currentProperty}
                    onSelect={this.changeCurrentProperty}
                    options={propertiesOptions}
                  />
                  <InputGroup.Addon>
                    <Button
                      bsStyle="success"
                      className="btn-icon"
                      onClick={() => this.editPropertyConfig()}
                      disabled={!currentProperty}
                    >
                      <IconConfiguration />
                    </Button>
                  </InputGroup.Addon>
                </InputGroup>
              </Col>
              <Col xs={9}>
                <h5>
                  <FormattedMessage id="portal.services.logDelivery.currentLogStorage.text"/>
                </h5>
                <div className="storage-metrics-container">
                  <h2>{storage.current.toString()} </h2>
                  <h5>{`/ ${storage.estimate} ${storage.unit}`}</h5>
                  <div className="storage-kpi-comparison-bars">
                    <ComparisonBars
                      referenceValue={storage.estimate}
                      currentValue={storage.current}
                    />
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Row>

        <SidePanel
          show={!!showModal}
          title={<FormattedMessage id="portal.services.logDelivery.configureLogDelivery.text"/>}
          subTitle={currentProperty}
          cancel={this.toggleModal}
        >
          <LogDeliveryConfigureForm
            config={propertyLogsConfig.toJS()}
            onCancel={this.toggleModal}
            onSave={this.savePropertyLogsConfig}
          />
        </SidePanel>
      </div>
    )
  }
}

LogDeliveryService.displayName = 'LogDeliveryService'
LogDeliveryService.propTypes = {
  activeGroup: PropTypes.instanceOf(Map),
  appState: PropTypes.object,
  changeNotification: React.PropTypes.func,
  createPropertyLogsConfig: PropTypes.func,
  currentProperty: PropTypes.string,
  fetchProperties: PropTypes.func,
  getPropertyLogsConfig: PropTypes.func,
  params: PropTypes.object,
  properties: PropTypes.object,
  updatePropertyLogsConfig: PropTypes.func
}

/* istanbul ignore next */
const mapStateToProps = (state, {params: { group }}) => {
  const properties = getPropertiesByGroup(state, group)

  return {
    activeGroup: getGroupById(state, group) || Map(),
    properties,
    currentProperty: properties.first(),
    appState: state
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchProperties: (params) => dispatch(propertiesActions.fetchAll(params)),
    getPropertyLogsConfig: (params) => dispatch(propertiesLogsActions.fetchOne(params)),
    updatePropertyLogsConfig: (params) => dispatch(propertiesLogsActions.update(params)),
    createPropertyLogsConfig: (params) => dispatch(propertiesLogsActions.create(params)),
    changeNotification: (message) => dispatch(changeNotification(message))
  }
}

export default connect(mapStateToProps, dispatchToProps)(LogDeliveryService)
