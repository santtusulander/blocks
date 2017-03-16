import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'

import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../button-dropdown'
import Toggle from '../toggle'

const StorageContents = ({ asperaUpload, contents, onMethodToggle, asperaInstanse, gatewayHostname, storageId, groupId, fileUploader }) => {
  const hasContents = contents && contents.length > 0
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
  const asperaShowSelectFileDialog = asperaInstanse.get('asperaShowSelectFileDialog') || (() => {})
  const asperaShowSelectFolderDialog = asperaInstanse.get('asperaShowSelectFolderDialog') || (() => {})
  const openFileDialog = asperaUpload ? asperaShowSelectFileDialog : fileUploader ? fileUploader.openFileDialog : (()=>{})
  const openFolderDialog = asperaUpload ? asperaShowSelectFolderDialog : fileUploader ? fileUploader.openFileDialog : (()=>{})
  const processFiles = fileUploader ? fileUploader.processFiles : (()=>{})

  return (
    <SectionContainer>
      <SectionHeader
        sectionHeaderTitle={headerTitle}>
        <FormGroup className="upload-toggle-group">
          <Col className="pull-left">
            <FormattedMessage id='portal.storage.summaryPage.contents.asperaToggle.title' />
          </Col>
          <Col xs={6} className="pull-right">
            <Toggle
              value={asperaUpload}
              onText='ON'
              offText='OFF'
              changeValue={onMethodToggle}
            />
          </Col>
        </FormGroup>
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
      </SectionHeader>
      { hasContents
        ? <StorageContentBrowser contents={contents} />
        : asperaUpload
        ? <AsperaUpload multiple={true} storageId={storageId} asperaGetaway={gatewayHostname} groupId={groupId} />
        : <HttpUpload processFiles={processFiles} openFileDialog={openFileDialog} />
      }
    </SectionContainer>
  )
}

StorageContents.displayName = 'StorageContents'

StorageContents.propTypes = {
  asperaInstanse: PropTypes.instanceOf(Map),
  asperaUpload: PropTypes.bool,
  contents: PropTypes.array,
  fileUploader: PropTypes.object,
  gatewayHostname: PropTypes.string,
  groupId: PropTypes.string,
  onMethodToggle: PropTypes.func,
  storageId: PropTypes.string
}

export default StorageContents
