import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'
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

    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  /**
   * Handle footprint save / update
   * @param edit
   * @param values
   */
  onSave(edit, values) {

    const finalValues = Object.assign({}, values, {
      value: normalizeValueToAPI(values[`value_${values.data_type}`]),
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
      .then(({ error, response }) => {
        if (error) {
          throw new SubmissionError({ '_error': error.data.message })
        }

        const { entities: { footprints } } = response

        //add new footprint to pod
        if (!edit) {
          //Grab the id from the response
          finalValues.id = Number(Object.keys(footprints)[0])
          this.props.addFootprintToPod(finalValues)
        }

        return this.props.onCancel()
      })
  }

  onDelete(id) {

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      id
    }

    return this.props.onDelete(params)
      .then(res => {
        if (res.error) {
          throw new SubmissionError({ '_error': res.error.data.message })
        }
        //return this.props.handleFootprintSaveResponse(res)
      })
  }

  render() {
    const {
      ASNOptions,
      CIDROptions,
      fetching,
      footprint,
      initialValues,
      intl,
      onCancel
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
          ASNOptions={ASNOptions}
          CIDROptions={CIDROptions}
          udnTypeOptions={FOOTPRINT_UDN_TYPES}

          onSave={(values) => this.onSave(edit, values)}
          onDelete={this.onDelete}
          onCancel={onCancel}
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
  accountId: PropTypes.number,
  addFootprintToPod: PropTypes.func,
  fetching: PropTypes.bool,
  footprint: PropTypes.instanceOf(Map),
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  location: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
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
