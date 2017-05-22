import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import { Row, Col, FormGroup, InputGroup, Button } from 'react-bootstrap'

import { Map, is } from 'immutable'

import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getIdsByGroup as getPropertiesByGroup } from '../../../redux/modules/entities/properties/selectors'
import propertiesActions from '../../../redux/modules/entities/properties/actions'

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
    this.savePropertyConfig = this.savePropertyConfig.bind(this)
    this.changeCurrentProperty = this.changeCurrentProperty.bind(this)
    
    this.state = {
      currentProperty: null,
      propertyConfig: {},
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
      showModal: !this.state.showModal,
      propertyConfig: {}
    })
  }

  editPropertyConfig() {
    this.toggleModal()
    this.setState({ propertyConfig: this.props.getPropertyConfig(this.props.currentProperty) })
  }

  savePropertyConfig(config) {
    this.props.updatePropertyConfig(config)
    this.toggleModal()
  }

  changeCurrentProperty(value) {
    this.setState({
      currentProperty: value
    })
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

    const { currentProperty } = this.state
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
          show={!!this.state.showModal}
          title={<FormattedMessage id="portal.services.logDelivery.configureLogDelivery.text"/>}
          subTitle={currentProperty}
          cancel={this.toggleModal}
        >
          <LogDeliveryConfigureForm
            config={this.state.propertyConfig}
            onCancel={this.toggleModal}
            onSave={this.savePropertyConfig}
          />
        </SidePanel>
      </div>
    )
  }
}

LogDeliveryService.displayName = 'LogDeliveryService'
LogDeliveryService.propTypes = {
  activeGroup: PropTypes.instanceOf(Map),
  currentProperty: PropTypes.string,
  fetchProperties: PropTypes.func,
  getPropertyConfig: PropTypes.func,
  params: PropTypes.object,
  properties: PropTypes.object,
  updatePropertyConfig: PropTypes.func
}

/* istanbul ignore next */
const mapStateToProps = (state, {params: { group }}) => {
  const properties = getPropertiesByGroup(state, group)

  return {
    activeGroup: getGroupById(state, group) || Map(),
    properties,
    currentProperty: properties.first()
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchProperties: (params) => dispatch(propertiesActions.fetchAll(params)),
    getPropertyConfig: () => ({ //TODO mock
      contact_first_name: "John",
      contact_second_name: "John",
      log_delivery_enabled: true,
      aggregation_interval: 30,
      log_types: ['conductor'],
      export_file_format: 'zip'
    }),
    updatePropertyConfig: () => {
      return () => ({success: true}) //TODO mock
    }
  }
}

export default connect(mapStateToProps, dispatchToProps)(LogDeliveryService)
