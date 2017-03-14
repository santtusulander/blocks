import { Component, Children, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable'

import { STORAGE_SERVICE_ID } from '../../constants/service-permissions'
import { hasService } from '../../util/helpers'
import * as groupActionCreators from '../../redux/modules/group'
import { getContentUrl } from '../../util/routes.js'

class StorageWrapper extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    const { activeGroup, fetchGroupData, params } = this.props
    if (!activeGroup && params) {
      fetchGroupData(params)
    }
  }

  componentWillReceiveProps ({ activeGroup, hasStorageService, params}) {
    if (activeGroup && !hasStorageService) {
      this.props.router.push(getContentUrl('group', params.group, params))
    }
  }

  render() {
    const { activeGroup, hasStorageService, children } = this.props
    const hihi = activeGroup && hasStorageService
    return (
      !!hihi && Children.only(children)
    )
  }
}

StorageWrapper.displayName='StorageWrapper'

StorageWrapper.propTypes = {
  activeGroup: PropTypes.instanceOf(Map),
  children: PropTypes.node,
  fetchGroupData: PropTypes.func,
  hasStorageService: PropTypes.bool,
  params: PropTypes.object,
  router: PropTypes.object
}

const mapStateToProps = (state) => {
  const activeGroup = state.group.get('activeGroup')
  const hasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
  return {
    activeGroup,
    hasStorageService
  }
}

const mapDispatchToProps = (dispatch) => {
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  return {
    fetchGroupData: ({brand, account, group}) => groupActions.fetchGroup(brand, account, group)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageWrapper)
