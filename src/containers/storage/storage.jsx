import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import { withRouter } from 'react-router'

import * as uiActionCreators from '../../redux/modules/ui'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

import * as groupActionCreators from '../../redux/modules/group'
import { hasService } from '../../util/helpers'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import { buildReduxId } from '../../redux/util'
import { getCurrentUser } from '../../redux/modules/user'

import StorageFormContainer from './modals/storage-modal.jsx'

import Content from '../../components/shared/layout/content'
import PageContainer from '../../components/shared/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

import { EDIT_STORAGE } from '../../constants/account-management-modals.js'
import { STORAGE_SERVICE_ID } from '../../constants/service-permissions'

import { getContentUrl } from '../../util/routes.js'
import { setStorageUploadMethod, getStorageUploadMethod } from '../../util/local-storage'

import IsAllowed from '../../components/shared/permission-wrappers/is-allowed'
import { CREATE_ACCESS_KEY } from '../../constants/permissions.js'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: getStorageUploadMethod() === 'aspera',
      fileUploader: null
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)

    this.editStorage = this.editStorage.bind(this)
    this.onModalCancel = this.onModalCancel.bind(this)
  }

  componentWillMount() {
    if (this.props.params.storage && this.props.params.group) {
      const { brand, account, group, storage } = this.props.params

      this.props.fetchStorage({
        brand: brand,
        account: account,
        group: group,
        id: storage
      })
    }

    //fetch Active group if there is none in redux
    if (!this.props.group && this.props.params) {
      this.props.fetchGroupData(this.props.params)
    }
  }

  componentWillReceiveProps({ group, hasStorageService, params}) {
    if (group && !hasStorageService) {
      //redirect when the group doesn't have storage service
      this.props.router.push(getContentUrl('group', params.group, params))
    }

    if (JSON.stringify(params) !== JSON.stringify(this.props.params)) {
      const { brand, account, group, storage } = params

      this.props.fetchStorage({
        brand: brand,
        account: account,
        group: group,
        id: storage
      })
    }
  }

  toggleUploadMehtod(asperaUpload) {
    setStorageUploadMethod(asperaUpload ? 'aspera' : 'http')
    this.setState({ asperaUpload })
  }

  editStorage(storageId, groupId) {
    this.setState({ storageToEdit: storageId, storageGroup: groupId });
    this.props.toggleModal(EDIT_STORAGE);
  }

  onModalCancel() {
    if (!this.props.storage) {
      const { params, router } = this.props
      router.push(getContentUrl('group', params.group, params))
    }
    this.props.toggleModal()
  }

  render() {
    const {
      account,
      accountManagementModal,
      asperaInstance,
      httpInstance,
      currentUser,
      group,
      hasStorageService,
      params,
      storage,
      storageContents,
      gatewayHostname,
      isFetchingContents
    } = this.props

    return (
      <Content>
        {group && hasStorageService &&
          <div>
            <StorageHeader
              currentUser={currentUser}
              params={params}
              toggleConfigModal={() => {
                this.editStorage(storage.get('ingest_point_id'), storage.get('parentId'))
              }}
            />

            <PageContainer>
              <StorageKPI storage={storage} params={params}/>
              <IsAllowed to={CREATE_ACCESS_KEY}>
                <StorageContents
                  gatewayHostname={gatewayHostname}
                  asperaInstance={asperaInstance}
                  httpInstance={httpInstance}
                  contents={storageContents}
                  asperaUpload={this.state.asperaUpload}
                  onMethodToggle={this.toggleUploadMehtod}
                  fileUploader={this.state.fileUploader}
                  params={params}
                  router={this.props.router}
                  isFetchingContents={isFetchingContents}
                  uploadPath={this.state.uploadPath}
                />
              </IsAllowed>
            </PageContainer>

            {(accountManagementModal === EDIT_STORAGE) &&
              <StorageFormContainer
                show={true}
                brand={account.get('brand_id')}
                accountId={account.get('id')}
                storageId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageToEdit : ''}
                groupId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageGroup : group.get('id')}
                fetching={false}
                onCancel={this.onModalCancel}
              />}
          </div> }
      </Content>
    )
  }
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountManagementModal: PropTypes.string,
  asperaInstance: PropTypes.instanceOf(Map),
  currentUser: PropTypes.instanceOf(Map),
  fetchGroupData: PropTypes.func,
  fetchStorage: PropTypes.func,
  gatewayHostname: PropTypes.string,
  group: PropTypes.instanceOf(Map),
  hasStorageService: PropTypes.bool,
  httpInstance: PropTypes.instanceOf(Map),
  isFetchingContents: PropTypes.bool,
  params: PropTypes.object,
  router: PropTypes.object,
  storage: PropTypes.instanceOf(Map),
  storageContents: PropTypes.instanceOf(List),
  toggleModal: PropTypes.func
}

Storage.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List)
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const asperaInstance = state.ui.get('asperaUploadInstance')
  const httpInstance = state.ui.get('httpUploadInstance')
  let storage = undefined

  if (ownProps.params.storage && ownProps.params.group) {
    const storageId = buildReduxId(ownProps.params.group, ownProps.params.storage)
    storage = getStorageById(state, storageId)

  }

  const gateway = storage && storage.get('gateway')
  const gatewayHostname = gateway && gateway.get('hostname')

  const group = state.group.get('activeGroup')
  const hasStorageService = hasService(group, STORAGE_SERVICE_ID)

  return {
    account: state.account.get('activeAccount'),
    accountManagementModal: state.ui.get('accountManagementModal'),
    gatewayHostname,
    asperaInstance: (asperaInstance && asperaInstance.get('asperaInitialized')) ? asperaInstance : new Map(),
    httpInstance: (httpInstance && httpInstance.get('httpInitialized')) ? httpInstance : new Map(),
    currentUser: getCurrentUser(state),
    storageAccessToken: state.user.get('storageAccessToken'),
    group: state.group.get('activeGroup'),
    hasStorageService,
    storage
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  return {
    fetchGroupData: ({brand, account, group}) => groupActions.fetchGroup(brand, account, group),
    fetchStorage: (params) => dispatch(storageActions.fetchOne(params)),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Storage))
