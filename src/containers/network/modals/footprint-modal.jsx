import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SubmissionError } from 'redux-form'
import { Map } from 'immutable'
import { injectIntl } from 'react-intl'

import footprintActions from '../../../redux/modules/entities/footprints/actions'
import * as uiActionCreators from '../../../redux/modules/ui'

import { getById } from '../../../redux/modules/entities/footprints/selectors'

import SidePanel from '../../../components/side-panel'
import FootprintForm from '../../../components/network/forms/footprint-form'

import { FOOTPRINT_UDN_TYPES, FOOTPRINT_DEFAULT_DATA_TYPE } from '../../../constants/network'

const normalizeValueToAPI = (value, type) => value.map(item => {
  return type === 'ipv4cidr' ? item.label : item.id
})
const normalizeValueFromAPI = (value) => value.map(item => ({ id: item, label: item }))

class FootprintFormContainer extends React.Component {

  constructor(props) {
    super(props)

    this.notificationTimeout = null
    this.onSave = this.onSave.bind(this)
    this.onCSVSave = this.onCSVSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }

  /**
   * Handle footprint save / update
   * @param edit
   * @param values
   */
  onSave(edit, values) {

    const finalValues = Object.assign({}, values, {
      value: normalizeValueToAPI(values[`value_${values.data_type}`], values.data_type),
      location: this.props.location
    })

    // Prevent API from nagging from unknown fields
    delete finalValues.addFootprintMethod
    delete finalValues.accountId
    delete finalValues.value_asnlist
    delete finalValues.value_ipv4cidr

    const save = edit ? this.props.onUpdate : this.props.onCreate

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      payload: finalValues
    }

    if (edit) {
      params.id = values.id
    }

    return save(params)
      .then((response) => {

        //add new footprint to pod
        if (!edit) {
          //Grab the id from the response
          finalValues.id = Number(Object.keys(response.entities.footprints)[0])
          this.props.addFootprintToPod(finalValues)
        }

        return this.props.onCancel()
      }).catch(response => {

        throw new SubmissionError({ '_error': response.data.message })

      })
  }

  onCSVSave(csvValues) {
    const finalValues = Object.assign({}, csvValues, {
      location: this.props.location
    })

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      payload: finalValues
    }

    return this.props.onCreate(params)
      .then((response) => {

        finalValues.id = Number(Object.keys(response.entities.footprints)[0])
        this.props.addFootprintToPod(finalValues)

        return this.props.onCancel()
      }).catch(response => {
        throw new SubmissionError({ '_error': response.data.message })
      })
  }

  onDelete(id) {

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      id
    }

    return this.props.onDelete(params)
      .then(() => {
        //return this.props.handleFootprintSaveResponse(res)
      }).catch(res => {

        throw new SubmissionError({ '_error': res.data.message })

      })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeSidePanelNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeSidePanelNotification, 10000)
  }

  render() {
    const {
      fetching,
      footprint,
      initialValues,
      intl,
      onCancel,
      footprintPermissions
    } = this.props

    const edit = !!footprint && !footprint.isEmpty()

    const formTitle = edit
      ? 'portal.network.footprintForm.title.edit.text'
      : 'portal.network.footprintForm.title.add.text'

    return (
      <SidePanel
        show={true}
        title={intl.formatMessage({ id: formTitle })}
        cancel={onCancel}
        overlapping={true}
      >
        <FootprintForm
          initialValues={initialValues}
          editing={edit}
          footprintId={footprint && !footprint.isEmpty() && footprint.get('id')}
          fetching={fetching}
          udnTypeOptions={FOOTPRINT_UDN_TYPES}
          showNotification={this.showNotification}
          onCSVSave={this.onCSVSave}
          onSave={(values) => this.onSave(edit, values)}
          onDelete={this.onDelete}
          onCancel={onCancel}
          footprintPermissions={footprintPermissions}
        />

      </SidePanel>
    )
  }
}

FootprintFormContainer.displayName = 'FootprintFormContainer'
FootprintFormContainer.defaultProps = {
  footprint: Map()
}
FootprintFormContainer.propTypes = {
  accountId: PropTypes.number,
  addFootprintToPod: PropTypes.func,
  fetching: PropTypes.bool,
  footprint: PropTypes.instanceOf(Map),
  footprintPermissions: PropTypes.object,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  location: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  uiActions: PropTypes.object
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch(footprintActions.create({ ...params, data })),
    onUpdate: (params, data) => dispatch(footprintActions.update({ ...params, data })),
    onDelete: (params) => dispatch(footprintActions.remove({ ...params })),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

const mapStateToProps = (state, ownProps) => {
  const editing = !!ownProps.footprintId
  const footprint = ownProps.footprintId && getById(state)(ownProps.footprintId)

  const defaultValues = {
    addFootprintMethod: 'manual',
    data_type: FOOTPRINT_DEFAULT_DATA_TYPE
  }

  const initialValues = editing && footprint ?
    Object.assign(
      {},
      { ...footprint.toJS() }, {
        addFootprintMethod: 'manual'
      }
    ) : defaultValues

  initialValues.value_ipv4cidr = normalizeValueFromAPI(initialValues.value && initialValues.data_type === 'ipv4cidr' ? initialValues.value : [])
  initialValues.value_asnlist = normalizeValueFromAPI(initialValues.value && initialValues.data_type === 'asnlist' ? initialValues.value : [])

  return {
    footprint,
    initialValues
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FootprintFormContainer))
