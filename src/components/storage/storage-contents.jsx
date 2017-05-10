import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Col, FormGroup, FormControl } from 'react-bootstrap'
import { Map, List } from 'immutable'

import { getContentUrl } from '../../util/routes.js'

import SectionContainer from '../shared/layout/section-container'
import SectionHeader from '../shared/layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../shared/form-elements/button-dropdown'
import Button from '../shared/form-elements/button'
import IconAdd from '../shared/icons/icon-add'

import Toggle from '../shared/form-elements/toggle'

class StorageContents extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.changeSearch = this.changeSearch.bind(this)
    this.backButtonHandler = this.backButtonHandler.bind(this)
    this.openDirectoryHandler = this.openDirectoryHandler.bind(this)
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

  getFilteredItems(items, searchTerm) {
    if (!searchTerm) {
      return items
    }
    const searchTermLowerCase = searchTerm.toLowerCase()
    return items.filter((item) => {
      return item.get('name').toLowerCase().includes(searchTermLowerCase)
    })
  }

  render() {
    const { search } = this.state
    const {
      asperaUpload,
      contents,
      onMethodToggle,
      asperaInstanse,
      gatewayHostname,
      storageId,
      brandId,
      accountId,
      groupId,
      fileUploader,
      isRootDirectory,
      intl } = this.props

    const hasContents = contents && contents.size > 0
    const headerTitle = hasContents
                        ?
                          (<FormattedMessage
                            id='portal.storage.summaryPage.contents.hasContents.title'
                            values={{
                              folders: contents.filter((item) => item.type === 'directory').length,
                              files: contents.filter((item) => item.type === 'file').length}} />)
                        :
                          <FormattedMessage id='portal.storage.summaryPage.contents.noFiles.title' />

    const uploadButtonIsDisabled = asperaUpload ? (asperaInstanse.size === 0) : false
    const asperaShowSelectFileDialog = asperaInstanse.get('asperaShowSelectFileDialog') || (() => { /* no-op */ })
    const asperaShowSelectFolderDialog = asperaInstanse.get('asperaShowSelectFolderDialog') || (() => { /* no-op */ })
    const openFileDialog = asperaUpload ? asperaShowSelectFileDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
    const openFolderDialog = asperaUpload ? asperaShowSelectFolderDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
    const processFiles = fileUploader ? fileUploader.processFiles : (() => { /* no-op */ })
    const filteredContents = this.getFilteredItems(contents, search)

    return (
      <SectionContainer>
        <SectionHeader
          sectionHeaderTitle={headerTitle}>
          <FormGroup className="upload-toggle-group">
            <Col xs={6} md={4} className="pull-left">
              <FormControl
                type="text"
                className="search-input"
                placeholder={intl.formatMessage({id: 'portal.common.search.text'})}
                value={search}
                disabled={!hasContents}
                onChange={this.changeSearch} />
            </Col>
            <Col xs={6} md={4} className="pull-right">
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
              contents={filteredContents}
              openDirectoryHandler={this.openDirectoryHandler}
              backButtonHandler={this.backButtonHandler}
              isRootDirectory={isRootDirectory}
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
  accountId: React.PropTypes.string,
  asperaInstanse: PropTypes.instanceOf(Map),
  asperaUpload: PropTypes.bool,
  brandId: React.PropTypes.string,
  contents: PropTypes.instanceOf(List),
  fileUploader: PropTypes.object,
  gatewayHostname: PropTypes.string,
  groupId: PropTypes.string,
  onMethodToggle: PropTypes.func,
  storageId: PropTypes.string
}

export default injectIntl(StorageContents)
