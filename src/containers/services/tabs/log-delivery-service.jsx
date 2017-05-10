import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import IconConfiguration from '../../../components/shared/icons/icon-configuration'

import { Row, Col, ControlLabel, FormGroup, InputGroup, Button } from 'react-bootstrap'
import { Map, List } from 'immutable'

import SidePanel from '../../../components/shared/side-panel'
import StorageKPI from '../../../components/storage/storage-kpi'
//import SectionContainer from '../../../components/shared/layout/section-container'
import LogDeliveryConfigureForm from '../../../components/services/log-delivery-configure-form'
import propertiesActions from '../../../redux/modules/entities/properties/actions'
import { getIdsByGroup as getPropertiesbyGroup, getById as getPropertyById } from '../../../redux/modules/entities/properties/selectors'

import Select from '../../../components/shared/form-elements/select'


// import {getProviderTypes, getServicesInfo, getProviderTypeName, getOptionName, getServiceName} from '../../../redux/modules/service-info/selectors'
// import {fetchAll as serviceInfofetchAll} from '../../../redux/modules/service-info/actions'
// import {fetchAccount, startFetching as accountStartFetching, getById as getAccountById, isFetching as accountsFetching} from '../../../redux/modules/account'

// import { getServicesIds } from '../../../util/services-helpers'

class LogDeliveryService extends React.Component {
  constructor(props) {
    super(props)

    this.editPropertyConfig = this.editPropertyConfig.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.savePropertyConfig = this.savePropertyConfig.bind(this)
    this.changeCurrentProperty = this.changeCurrentProperty.bind(this)
    
    this.state = {
      currentProperty: null,
      propertyConfig: {},
      showModal: false
    }
  }

  componentWillMount() {
    this.props.fetchProperties(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentProperty !== nextProps.currentProperty) {
      this.setState({
        currentProperty: nextProps.currentProperty
      })
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
    const propertiesOptions = this.props.properties.toJS().map((host) => ({label: host, value: host}))
    const { currentProperty } = this.state
    const storage = {
      current: 100,
      estimated: 500,
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
                <StorageKPI
                  currentValue={storage.current}
                  referenceValue={storage.estimated}
                  valuesUnit={storage.unit}
                  showLabels={false}
                />
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
  // account: PropTypes.instanceOf(Map),
  // accountIsFetching: PropTypes.bool,
  // accountStartFetching: PropTypes.func,
  // fetchAccountDetails: PropTypes.func,
  // fetchServiceInfo: PropTypes.func,
  params: PropTypes.object
}

/* istanbul ignore next */
const mapStateToProps = (state, {params: {group, property}}) => {
  const activeProperty = getPropertyById(state, property)

  const properties = getPropertiesbyGroup(state, group) || List()

  return {
    properties,
    currentProperty: activeProperty || properties.first()
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchProperties: (params) => dispatch(propertiesActions.fetchAll(params)),
    getPropertyConfig: (property) => ({
      aaa: 'asdasf'
    }),
    updatePropertyConfig: (params) => {
      return ()=>({success: true})
    }
  }
}

export default connect(mapStateToProps, dispatchToProps)(LogDeliveryService)
