import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import SidePanel from '../../../components/side-panel'
import FootprintForm from '../../../components/network/forms/footprint-form'

class FootprintFormContainer extends React.Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSubmit } = this.props

    onSubmit(values)
  }

  render() {
    const {
      ASNOptions,
      CIDROptions,
      editing,
      intl,
      onCancel,
      show,
      UNDTypeOptions
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
          ASNOptions={ASNOptions}
          CIDROptions={CIDROptions}
          UNDTypeOptions={UNDTypeOptions}
          onCancel={onCancel}
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
  editing: PropTypes.bool,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  show: PropTypes.bool,
  UNDTypeOptions: PropTypes.array
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FootprintFormContainer))
