import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SidePanel from '../../../components/side-panel'

import PodForm from '../../../components/network/forms/pod-form'

//TODO Remove mockInitialValues after Redux integration
const mockInitialValues = {
  get: function(field) {
    switch (field) {
      case 'pod_name':
        return 'pod1'

      case 'lb_method':
        return 1

      case 'pod_type':
        return 2

      case 'localAS':
        return 'AS206810'

      default:
        return null
    }
  }
}

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props
    return onSave(values)
  }

  render() {
    const {
      account,
      brand,
      group,
      groupName,
      network,
      pop,
      podId,
      initialValues,
      show,
      onCancel,
      intl,
      invalid} = this.props

    const title = <FormattedMessage id="portal.network.podForm.newPod.title"/>
    const subTitle = `${groupName} / ${network} / ${pop}${podId ? ' / ' + podId : ''}`
    return (
      <div>
        <SidePanel
          className="pod-form-sidebar"
          show={show}
          title={title}
          subTitle={subTitle}
          cancel={onCancel}>
          <PodForm
            podId={podId}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            onCancel={onCancel}
            onSubmit={this.onSubmit}
            brand={brand}
            account={account}
            pop={pop}
            group={group}
            network={network} />
        </SidePanel>
      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  account: PropTypes.string,
  brand: PropTypes.string,
  group: PropTypes.string,
  groupName: PropTypes.string,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  podId: PropTypes.number,
  pop: PropTypes.string,
  show: PropTypes.bool
}

function mapStateToProps( state, { podId, group }) {
  const props = {
    //TODO: replace .get('allGroups') with .get('activeGroup')
    groupName: state.group
      .get('allGroups')
      .filter((groupElements) => groupElements.get('id') == group)
      .getIn([0, 'name']),
    initialValues: podId ? {
      pod_name: mockInitialValues.get('pod_name'),
      lb_method: mockInitialValues.get('lb_method'),
      pod_type: mockInitialValues.get('pod_type'),
      localAS: mockInitialValues.get('localAS')
    } : {}
  }
  return props
}

export default connect(mapStateToProps)(
  injectIntl(PodFormContainer)
)
