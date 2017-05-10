import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Col, FormGroup, FormControl } from 'react-bootstrap'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'

import { getContentUrl } from '../../util/routes.js'
import { getSortData } from '../../util/helpers'

import SectionContainer from '../shared/layout/section-container'
import SectionHeader from '../shared/layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../shared/form-elements/button-dropdown'
import Button from '../shared/form-elements/button'
import IconAdd from '../shared/icons/icon-add'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm'

import Toggle from '../shared/form-elements/toggle'

import storageContentsActions from '../../redux/modules/entities/CIS-ingest-point-contents/actions'
import { getById as getStorageContentsById } from '../../redux/modules/entities/CIS-ingest-point-contents/selectors'

import { getFetchingByTag } from '../../redux/modules/fetching/selectors'

import { buildReduxId } from '../../redux/util'

class StorageContents extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.changeSort = this.changeSort.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.backButtonHandler = this.backButtonHandler.bind(this)
    this.openDirectoryHandler = this.openDirectoryHandler.bind(this)
  }

  componentWillMount() {
    this.fetchStorageContents(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.splat !== this.props.params.splat) {
      this.fetchStorageContents(nextProps.params)
    }
  }

  fetchStorageContents(params) {
    const { brand, account, group, storage, splat } = params
    this.props.fetchStorageContents({
      brand,
      account,
      group,
      id: storage,
      path: splat
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

  getHeader(contents) {
    const { foldersCount: folders, filesCount: files } = contents.reduce(({ foldersCount, filesCount }, item) => {
      if (item.get('type') === 'directory') {
        foldersCount = foldersCount + 1
      } else {
        filesCount = filesCount + 1
      }
      return { foldersCount, filesCount }
    }, { foldersCount: 0, filesCount: 0 })

    return (<FormattedMessage
      id='portal.storage.summaryPage.contents.hasContents.title'
      values={{ folders, files }} />)
  }

  render() {
    const { search, sortBy, sortDir } = this.state
    const {
      asperaUpload,
      contents,
      onMethodToggle,
      asperaInstanse,
      gatewayHostname,
      fileUploader,
      isRootDirectory,
      isFetchingContents,
      intl,
      params } = this.props

    const { brand: brandId, account: accountId, storage: storageId, group: groupId } = params
    const hasContents = contents && contents.size > 0
    const headerTitle = hasContents
                        ?
                          this.getHeader(contents)
                        :
                          <FormattedMessage id='portal.storage.summaryPage.contents.noFiles.title' />

    const uploadButtonIsDisabled = asperaUpload ? (asperaInstanse.size === 0) : false
    const asperaShowSelectFileDialog = asperaInstanse.get('asperaShowSelectFileDialog') || (() => { /* no-op */ })
    const asperaShowSelectFolderDialog = asperaInstanse.get('asperaShowSelectFolderDialog') || (() => { /* no-op */ })
    const openFileDialog = asperaUpload ? asperaShowSelectFileDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
    const openFolderDialog = asperaUpload ? asperaShowSelectFolderDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
    const processFiles = fileUploader ? fileUploader.processFiles : (() => { /* no-op */ })

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: sortBy,
      activeDirection: sortDir
    }
    const filteredContents = contents && this.getFilteredItems(contents, search)
    const modifiedContents = filteredContents && this.getModifiedContents(filteredContents)
    const sortedContents = modifiedContents && getSortData(modifiedContents, sortBy, sortDir)

    return isFetchingContents
    ?
      <div className='storage-contents-spinner'><LoadingSpinnerSmall /></div>
    :
      (<SectionContainer>
        <SectionHeader
          sectionHeaderTitle={headerTitle}>
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
                  onText='ON'
                  offText='OFF'
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
              disabled={!fileUploader}
            >
              <IconAdd/>
            </Button>
          }
        </SectionHeader>
        { hasContents
          ? <StorageContentBrowser
              contents={sortedContents}
              openDirectoryHandler={this.openDirectoryHandler}
              backButtonHandler={this.backButtonHandler}
              isRootDirectory={isRootDirectory}
              sorterProps={sorterProps}
            />
          : asperaUpload
          ? <AsperaUpload
              multiple={true}
              brandId={brandId}
              accountId={accountId}
              groupId={groupId}
              storageId={storageId}
              asperaGetaway={gatewayHostname}
            />
          : <HttpUpload processFiles={processFiles} openFileDialog={openFileDialog} />
        }
      </SectionContainer>
      )
  }
}

StorageContents.displayName = 'StorageContents'

StorageContents.propTypes = {
  asperaInstanse: PropTypes.instanceOf(Map),
  asperaUpload: PropTypes.bool,
  contents: PropTypes.instanceOf(List),
  fetchStorageContents: PropTypes.func,
  fileUploader: PropTypes.object,
  gatewayHostname: PropTypes.string,
  intl: intlShape,
  isFetchingContents: PropTypes.bool,
  isRootDirectory: PropTypes.bool,
  onMethodToggle: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object
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
    isFetchingContents: getFetchingByTag(state, 'ingestPointContents')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  fetchStorageContents: (params) => dispatch(storageContentsActions.fetchAll(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StorageContents))
