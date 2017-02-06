import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
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

  componentWillMount() {
    const { brand, account, footprintId, fetchFootprint } = this.props
    footprintId && fetchFootprint({ brand, account, id: footprintId })

  }

  onSubmit(values) {
    const { onSave } = this.props

    const finalValues = Object.assign({}, values, {
      value: normalizeValueToAPI(values.value),
      location: 'fin' // TODO: add from location form
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
FootprintFormContainer.propTypes = {
  ASNOptions: PropTypes.array,
  CIDROptions: PropTypes.array,
  account: PropTypes.string,
  brand: PropTypes.string,
  editing: PropTypes.bool,
  fetchFootprint: PropTypes.func,
  fetching: PropTypes.bool,
  footprintId: PropTypes.number,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFootprint: (params) => dispatch(footprintActions.fetchOne(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FootprintFormContainer))
