import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Col, FormGroup, FormControl } from 'react-bootstrap'
import { Map, List, is } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getContentUrl } from '../../util/routes.js'
import { getSortData } from '../../util/helpers'

import SectionContainer from '../shared/layout/section-container'
import SectionHeader from '../shared/layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import UploadDestinationStatus from './upload-destination-status'
import ButtonDropdown from '../shared/form-elements/button-dropdown'
import Button from '../shared/form-elements/button'
import IconAdd from '../shared/icons/icon-add'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'

import Toggle from '../shared/form-elements/toggle'

import uploadActions from '../../redux/modules/http-file-upload/actions'
import storageContentsActions from '../../redux/modules/entities/CIS-ingest-point-contents/actions'
import { getById as getStorageContentsById } from '../../redux/modules/entities/CIS-ingest-point-contents/selectors'
import { getFetchingByTag } from '../../redux/modules/fetching/selectors'
import { buildReduxId } from '../../redux/util'

import {
  ASPERA_DEFAULT_DESTINATION_FOLDER,
  HTTP_DEFAULT_DESTINATION_FOLDER
} from '../../constants/storage'

class StorageContents extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accessKey: '',
      isDragging: false,
      draggingOver: null,
      search: '',
      sortBy: 'name',
      sortDir: 1,
      uploadPath: '',
      baseUploadPath: ''
    }

    this.changeSort = this.changeSort.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.backButtonHandler = this.backButtonHandler.bind(this)
    this.openDirectoryHandler = this.openDirectoryHandler.bind(this)
    this.generateUploadPath = this.generateUploadPath.bind(this)
    this.appendTargetDirNameToPath = this.appendTargetDirNameToPath.bind(this)

    this.handleAsperaEvents = this.handleAsperaEvents.bind(this)

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  componentWillMount() {
    this.fetchStorageContents(this.props.params)
  }

  componentDidMount() {
    this.generateUploadPath()
    this.appendTargetDirNameToPath()
  }

  componentWillReceiveProps(nextProps) {
    //upload was inProgress but is now empty ie. upload(s) were finnished => refresh view
    if (!is(nextProps.uploadsInProgress, this.props.uploadsInProgress) && nextProps.uploadsInProgress.isEmpty()) {
      this.fetchStorageContents({forceReload: true, ...nextProps.params})
    }

    if (nextProps.params.splat !== this.props.params.splat) {
      this.fetchStorageContents(nextProps.params)
    }

    this.generateUploadPath()
    this.appendTargetDirNameToPath()
  }

  /**
   * This function buils base upload path for Aspera and HTTP upload
   */
  generateUploadPath() {
    const { params } = this.props
    const asperaUpload = this.props.asperaUpload
    const isUploadToRoot = params.splat ? false : true

    let baseUploadPath = ''
    if (isUploadToRoot) {
      baseUploadPath = (asperaUpload ? ASPERA_DEFAULT_DESTINATION_FOLDER : HTTP_DEFAULT_DESTINATION_FOLDER)
    } else {
      baseUploadPath = params.splat
      /* Upload path for Aspera should include './' prefix */
      if (asperaUpload && baseUploadPath.indexOf('.') !== 0) {
        baseUploadPath = `${ASPERA_DEFAULT_DESTINATION_FOLDER}${baseUploadPath}`
      }

      /* Upload path for HTTP should include '/' prefix */
      if (!asperaUpload && baseUploadPath.indexOf('/') !== 0) {
        baseUploadPath = `/${baseUploadPath}`
      }

      /* Taling slash is reqired for both upload methods */
      if (baseUploadPath.substr(-1) !== '/') {
        baseUploadPath = `${baseUploadPath}/`
      }
    }

    this.setState({
      baseUploadPath: baseUploadPath
    })
  }

  /**
   * This function buils upload path (wnen user drop file into dir) for Aspera and HTTP upload
   */
  appendTargetDirNameToPath(dropIntoDir) {
    let uploadPath = this.state.baseUploadPath

    /* Taling slash is reqired for both upload methods */
    if (dropIntoDir && (uploadPath.substr(-1) !== '/')) {
      uploadPath = `${uploadPath}/${dropIntoDir}/`
    } else if (dropIntoDir && (uploadPath.substr(-1) === '/')) {
      uploadPath = `${uploadPath}${dropIntoDir}/`
    }

    this.setState({
      uploadPath: uploadPath
    })
  }

  fetchStorageContents(params) {
    const { forceReload, brand, account, group, storage, splat } = params
    this.props.fetchStorageContents({
      brand,
      account,
      group,
      id: storage,
      path: splat,
      forceReload
    })
  }

  backButtonHandler() {
    const { params, params: { splat, storage }, router } = this.props
    const splatArray = splat.split('/')
    if (splatArray.length > 1) {
      router.push(getContentUrl('storageContents', splatArray.slice(0, -1).join('/'), params))
    } else {
      router.push(getContentUrl('storage', storage, params))
    }
  }

  openDirectoryHandler(dirName) {
    const { params, params: { splat }, router } = this.props
    router.push(getContentUrl('storageContents', `${splat ? `${splat}/${dirName}` : dirName}`, params))
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  changeSort(sortBy, sortDir) {
    this.setState({ sortBy, sortDir })
  }

  getFilteredItems(items, searchTerm) {
    if (!searchTerm) {
      return items
    }
    const searchTermLowerCase = searchTerm.toLowerCase()
    return items.filter((item) => {
      return item.get('name').toLowerCase().includes(searchTermLowerCase)
    })
  }

  getModifiedContents(items) {
    return items.map(item => {
      return item.get('type') === 'directory' ? item.set('size', null) : item
    })
  }

  getSortedData(modifiedContents, sortBy, sortDir) {
    const sortedContents = modifiedContents
      .groupBy(item => item.get('type'))
      .map(items => getSortData(items, sortBy, sortDir))
    const folders = sortedContents.get('directory') || List()
    const files = sortedContents.get('file') || List()
    return folders.concat(files)
  }

  getHeaderBreadcrumb() {
    const { params, params: { storage, splat } } = this.props
    const links = []
    if (splat && splat.length > 0) {
      links.push({
        url: getContentUrl('storage', storage, params),
        label: storage
      })

      const pathArray = splat.split('/')
      pathArray.slice(0, -1).forEach((dir, index) => {
        links.push({
          url: getContentUrl('storageContents', pathArray.slice(0, (index + 1)).join('/'), params),
          label: dir
        })
      })

      links.push({
        url: null,
        label: pathArray.slice(-1).shift()
      })

    } else {
      links.push({
        url: null,
        label: storage
      })
    }

    return (
      <div className='storage-contents-breadcrumb'>
        <Breadcrumbs links={links} />
      </div>
    )
  }

  clearDragState() {
    this.setDragState(false, null)
  }

  setDragState(isDragging, draggingOver) {
    if (isDragging !== this.state.isDragging || draggingOver !== this.state.draggingOver) {
      this.setState({ isDragging, draggingOver })
    }
  }

  setDragEventState(event) {
    let node = event.target
    let dropzone
    while (node !== document.body) {
      if (node.dataset && node.dataset.dropZone) {
        dropzone = node
        break
      }
      node = node.parentNode
    }

    if (dropzone) {
      const { dataset } = dropzone

      this.appendTargetDirNameToPath(dataset.dropDir)

      this.setDragState(true, dataset.dropDir ? dataset.dropDir : null)
    } else {
      this.clearDragState()
    }
  }

  onDragEnter(event) {
    this.setDragEventState(event)
  }

  onDragLeave() {
    this.clearDragState()
  }

  onDragOver(event) {
    if (!this.state.isDragging) {
      this.setDragEventState(event)
    }
  }

  onDrop() {
    this.clearDragState()
  }

  /**
   * This is an Event Handler for Aspera Events
   * Handles 'transfer' -type events and reloads contents when transfer.status === 'completed'
   */
  handleAsperaEvents(event, obj) {
    if (event === 'transfer') {
      if (obj.transfers.some(tr => tr.status === 'completed')) {
        this.fetchStorageContents({forceReload: true, ...this.props.params})
      }
    }
  }

  render() {
    const { search, sortBy, sortDir, uploadPath } = this.state
    const {
      asperaUpload,
      contents,
      onMethodToggle,
      httpInstance,
      asperaInstance,
      gatewayHostname,
      uploadHandlers,
      isFetchingContents,
      intl,
      params,
      userDateFormat
    } = this.props

    const { storage: storageId} = params
    const isRootDirectory = params.splat ? false : true
    const hasContents = contents && contents.size > 0
    const hasFiles = hasContents && contents.filter(item => item.get('type') !== 'directory').size > 0

    const uploadButtonIsDisabled = asperaUpload ? (asperaInstance.size === 0) : (httpInstance.size === 0)
    const asperaShowSelectFileDialog = asperaInstance.get('asperaShowSelectFileDialog') || (() => { /* no-op */ })
    const asperaShowSelectFolderDialog = asperaInstance.get('asperaShowSelectFolderDialog') || (() => { /* no-op */ })
    const httpOpenFileDialog = httpInstance.get('openFileDialog') || (() => { /* no-op */ })

    const openFileDialog = asperaUpload ? asperaShowSelectFileDialog : httpOpenFileDialog
    const openFolderDialog = asperaUpload ? asperaShowSelectFolderDialog : httpOpenFileDialog

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: sortBy,
      activeDirection: sortDir
    }
    const filteredContents = contents && this.getFilteredItems(contents, search)
    const modifiedContents = filteredContents && this.getModifiedContents(filteredContents)
    const sortedContents = modifiedContents && this.getSortedData(modifiedContents, sortBy, sortDir)
    const highlightedItem = hasFiles
      ?
        (this.state.isDragging) ? this.state.draggingOver : undefined
      :
        (this.state.isDragging && this.state.draggingOver) ? this.state.draggingOver : undefined
    const renderDropZone = !hasContents || !hasFiles
    const highlightZoneOnDrag = this.state.isDragging && this.state.draggingOver === null
    const uploadDestinationFolder = this.state.draggingOver ? this.state.draggingOver : (isRootDirectory ? storageId : params.splat.split('/').slice(-1).shift())

    return (
      <SectionContainer>
        <SectionHeader
          sectionSubHeaderTitle={this.getHeaderBreadcrumb()}>
          <FormGroup className="upload-toggle-group">
            <Col xs={6} className="pull-left">
              <FormControl
                type="text"
                className="search-input"
                placeholder={intl.formatMessage({id: 'portal.common.search.text'})}
                value={search}
                disabled={!hasContents}
                onChange={this.changeSearch} />
            </Col>
            <Col xs={6} className="pull-right">
              <Col className="pull-left">
                <FormattedMessage id='portal.storage.summaryPage.contents.asperaToggle.title' />
              </Col>
              <Col className="pull-right">
                <Toggle
                  value={asperaUpload}
                  onText={intl.formatMessage({id: 'portal.shared.toggle.label.on'})}
                  offText={intl.formatMessage({id: 'portal.shared.toggle.label.off'})}
                  changeValue={onMethodToggle}
                />
              </Col>
            </Col>
          </FormGroup>

          { asperaUpload &&
            <ButtonDropdown
              bsStyle="success"
              pullRight={true}
              disabled={uploadButtonIsDisabled}
              options={[
                {
                  label: <FormattedMessage id='portal.storage.summaryPage.contents.newFile.label' />,
                  handleClick: openFileDialog
                },
                {
                  label: <FormattedMessage id='portal.storage.summaryPage.contents.newFolder.label' />,
                  handleClick: openFolderDialog
                }
              ]}
            />
          }
          { !asperaUpload &&
            <Button
              bsStyle="success"
              icon={true}
              onClick={openFileDialog}
              disabled={uploadButtonIsDisabled}
            >
              <IconAdd/>
            </Button>
          }
        </SectionHeader>

        {isFetchingContents
          ?
            <div className='storage-contents-spinner'><LoadingSpinnerSmall /></div>
          :
            asperaUpload
              ?
                <AsperaUpload
                  params={params}
                  multiple={true}
                  asperaGetaway={gatewayHostname}
                  renderDropZone={renderDropZone}
                  highlightZoneOnDrag={highlightZoneOnDrag}
                  onDragEnter={this.onDragEnter}
                  onDragLeave={this.onDragLeave}
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                  uploadPath={uploadPath}
                >
                  {hasContents
                    ?
                      <StorageContentBrowser
                        contents={sortedContents}
                        openDirectoryHandler={this.openDirectoryHandler}
                        backButtonHandler={this.backButtonHandler}
                        isRootDirectory={isRootDirectory}
                        sorterProps={sorterProps}
                        highlightedItem={highlightedItem}
                        userDateFormat={userDateFormat}
                        params={params}
                      />
                    :
                      null
                  }
                </AsperaUpload>
              :
                <HttpUpload
                  params={params}
                  uploadHandlers={uploadHandlers}
                  gatewayHostname={gatewayHostname}
                  openFileDialog={openFileDialog}
                  renderDropZone={renderDropZone}
                  highlightZoneOnDrag={highlightZoneOnDrag}
                  onDragEnter={this.onDragEnter}
                  onDragLeave={this.onDragLeave}
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                  uploadPath={uploadPath}
                >
                  {hasContents
                    ?
                      <StorageContentBrowser
                        contents={sortedContents}
                        openDirectoryHandler={this.openDirectoryHandler}
                        backButtonHandler={this.backButtonHandler}
                        isRootDirectory={isRootDirectory}
                        sorterProps={sorterProps}
                        highlightedItem={highlightedItem}
                        userDateFormat={userDateFormat}
                        params={params}
                      />
                    :
                      null
                  }
                </HttpUpload>
        }

        { this.state.isDragging &&
          <UploadDestinationStatus folderName={uploadDestinationFolder} />
        }
      </SectionContainer>
    )
  }
}

StorageContents.displayName = 'StorageContents'

StorageContents.propTypes = {
  asperaInstance: PropTypes.instanceOf(Map),
  asperaUpload: PropTypes.bool,
  contents: PropTypes.instanceOf(List),
  fetchStorageContents: PropTypes.func,
  gatewayHostname: PropTypes.string,
  httpInstance: PropTypes.instanceOf(Map),
  intl: intlShape,
  isFetchingContents: PropTypes.bool,
  onMethodToggle: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  uploadHandlers: PropTypes.object,
  uploadsInProgress: PropTypes.object,
  userDateFormat: PropTypes.string
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const { group, storage, splat } = ownProps.params
  let contents
  if (storage) {
    const contentsId = buildReduxId(group, storage, splat || '')
    contents = getStorageContentsById(state, contentsId)
  }

  return {
    contents,
    isFetchingContents: getFetchingByTag(state, 'ingestPointContents'),
    userDateFormat: state.user.get('currentUser').get('date_format'),
    uploadsInProgress: state.storageUploads

  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  fetchStorageContents: (params) => dispatch(storageContentsActions.fetchAll(params)),
  uploadHandlers: bindActionCreators(uploadActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StorageContents))
