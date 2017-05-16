import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import { withRouter } from 'react-router'

import * as uiActionCreators from '../../redux/modules/ui'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'
import { getStorageAccessKey } from '../../redux/modules/user'

import uploadActions from '../../redux/modules/http-file-upload/actions'

import FileUploader from '../../redux/modules/http-file-upload/uploader/file-uploader'
import * as groupActionCreators from '../../redux/modules/group'
import { hasService } from '../../util/helpers'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import { buildReduxId, parseResponseError } from '../../redux/util'
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

import { checkUserPermissions } from '../../util/permissions'
import IsAllowed from '../../components/shared/permission-wrappers/is-allowed'
import { CREATE_ACCESS_KEY } from '../../constants/permissions.js'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false,
      fileUploader: null
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)

    this.editStorage = this.editStorage.bind(this)
    this.onModalCancel = this.onModalCancel.bind(this)
    this.initFileUploader = this.initFileUploader.bind(this)
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

  componentDidMount() {
    const { brand, account, group, storage } = this.props.params

    if (checkUserPermissions(this.context.currentUser, CREATE_ACCESS_KEY)) {
      this.props.initStorageAccessKey(brand, account, group, storage)
        .then(this.initFileUploader)
        .catch(parseResponseError)
    }
  }

  componentWillReceiveProps ({ group, hasStorageService, params}) {
    if (group && !hasStorageService) {
      //redirect when the group doesn't have storage service
      this.props.router.push(getContentUrl('group', params.group, params))
    }

    if (JSON.stringify(params) !== JSON.stringify(this.props.params)) {
      const { brand, account, group, storage } = params

      if (checkUserPermissions(this.context.roles, this.context.currentUser, CREATE_ACCESS_KEY)) {
        this.props.initStorageAccessKey(brand, account, group, storage)
          .then(this.initFileUploader)
          .catch(parseResponseError)
      }

      this.props.fetchStorage({
        brand: brand,
        account: account,
        group: group,
        id: storage
      })
    }
  }

  /**
   * Initialize File Uploader
   * @param action {object} - action with type and payload
   */
  initFileUploader(action) {
    const { gatewayHostname, uploadHandlers } = this.props
    this.setState({
      fileUploader: FileUploader.initialize(action.payload, gatewayHostname, uploadHandlers)
    })
  }

  toggleUploadMehtod(asperaUpload) {
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
      asperaInstanse,
      currentUser,
      group,
      hasStorageService,
      params,
      storage,
      storageContents,
      gatewayHostname
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
                  brandId={params.brand}
                  accountId={params.account}
                  storageId={params.storage}
                  groupId={params.group}
                  gatewayHostname={gatewayHostname}
                  asperaInstanse={asperaInstanse}
                  contents={storageContents}
                  asperaUpload={this.state.asperaUpload}
                  onMethodToggle={this.toggleUploadMehtod}
                  fileUploader={this.state.fileUploader}
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
  asperaInstanse: PropTypes.instanceOf(Map),
  currentUser: PropTypes.instanceOf(Map),
  fetchGroupData: PropTypes.func,
  fetchStorage: PropTypes.func,
  gatewayHostname: PropTypes.string,
  group: PropTypes.instanceOf(Map),
  hasStorageService: PropTypes.bool,
  initStorageAccessKey: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  storage: PropTypes.instanceOf(Map),
  storageContents: PropTypes.array,
  toggleModal: PropTypes.func,
  uploadHandlers: PropTypes.object
}

Storage.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List)
}

const getMockContents = (storage) => {
  return storage === 'with-contents' ? [
    {
      type: 'file',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'In Progress'
    },
    {
      type: 'file',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'In Progress'
    },
    {
      type: 'directory',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'Completed',
      noOfFiles: 1000
    },
    {
      type: 'directory',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'Failed',
      noOfFiles: 800
    }
  ] : []
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const asperaInstanse = state.ui.get('asperaUploadInstanse')
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
    asperaInstanse: asperaInstanse.get('asperaInitialized') ? asperaInstanse : new Map(),
    currentUser: getCurrentUser(state),
    storageAccessToken: state.user.get('storageAccessToken'),
    group: state.group.get('activeGroup'),
    hasStorageService,
    storage,
    storageContents: getMockContents(ownProps.params.storage)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  return {
    fetchGroupData: ({brand, account, group}) => groupActions.fetchGroup(brand, account, group),
    fetchStorage: (params) => dispatch(storageActions.fetchOne(params)),
    initStorageAccessKey: bindActionCreators(getStorageAccessKey, dispatch),
    uploadHandlers: bindActionCreators(uploadActions, dispatch),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Storage))
