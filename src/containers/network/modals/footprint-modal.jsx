import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { /*formValueSelector,*/ SubmissionError } from 'redux-form'
import { Map } from 'immutable'
import { injectIntl } from 'react-intl'

import footprintActions from '../../../redux/modules/entities/footprints/actions'

import { getById } from '../../../redux/modules/entities/footprints/selectors'

import SidePanel from '../../../components/side-panel'
import FootprintForm from '../../../components/network/forms/footprint-form'

import { FOOTPRINT_UDN_TYPES, FOOTPRINT_DEFAULT_DATA_TYPE } from '../../../constants/network'

const normalizeValueToAPI = (value) => value.map(item => item.label)
const normalizeValueFromAPI = (value) => value.map(item => ({ id: item, label: item }))

class FootprintFormContainer extends React.Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  /**
   * Handle footprint save / update
   * @param values
   */
  onSaveFootprint(values) {

    const { footprintId } = this.state
    const save = footprintId ? this.props.onUpdateFootprint : this.props.onCreateFootprint

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      payload: values
    }

    if (footprintId) {
      params.id = footprintId
    }

    return save(params)
      .then(res => {
        if (res.error) {
          throw new SubmissionError({ '_error': res.error.data.message })
        }
        return this.handleFootprintSaveResponse(res)
      })
  }

  onDeleteFootprint(id) {

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      id
    }

    return this.props.onDeleteFootprint(params)
      .then(res => {
        if (res.error) {
          throw new SubmissionError({ '_error': res.error.data.message })
        }
        return this.handleFootprintSaveResponse(res)
      })
  }


  onSubmit(values) {
    const { onSave, location } = this.props

    const finalValues = Object.assign({}, values, {
      value: normalizeValueToAPI(values.value),
      location
    })

    // Prevent API from nagging from unknown field
    delete finalValues.addFootprintMethod

    onSave(finalValues)
  }

  render() {
    const {
      ASNOptions,
      CIDROptions,
      editing,
      fetching,
      footprint,
      initialValues,
      intl,
      onCancel,
      onDelete,
      show
    } = this.props

    const formTitle = editing
      ? 'portal.network.footprintForm.title.edit.text'
      : 'portal.network.footprintForm.title.add.text'

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: formTitle })}
        cancel={onCancel}
      >
        <FootprintForm
          initialValues={initialValues}
          editing={editing}
          footprintId={footprint && !footprint.isEmpty() && footprint.get('id')}
          fetching={fetching}
          ASNOptions={ASNOptions}
          CIDROptions={CIDROptions}
          udnTypeOptions={FOOTPRINT_UDN_TYPES}
          onCancel={onCancel}
          onDelete={onDelete}
          onSubmit={this.onSubmit}
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
  ASNOptions: PropTypes.array,
  CIDROptions: PropTypes.array,
  editing: PropTypes.bool,
  fetching: PropTypes.bool,
  footprint: PropTypes.instanceOf(Map),
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  location: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCreate: (params, data) => dispatch(footprintActions.create({ ...params, data })),
    onUpdate: (params, data) => dispatch(footprintActions.update({ ...params, data })),
    onDelete: (params) => dispatch(footprintActions.remove({ ...params }))
  }


}
const mapStateToProps = (state, ownProps) => {
  const editing = !!ownProps.footprintId
  const footprint = ownProps.footprintId && getById(state)(ownProps.footprintId)

  const defaultValues = {
    addFootprintMethod: 'manual',
    value: [],
    data_type: FOOTPRINT_DEFAULT_DATA_TYPE
  }

  const initialValues = editing && footprint ?
    Object.assign(
      {},
      { ...footprint.toJS() }, {
        addFootprintMethod: 'manual'
      }
    ) : defaultValues

  initialValues.value = normalizeValueFromAPI(initialValues.value)

  return {
    editing,
    footprint,
    initialValues
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FootprintFormContainer))
