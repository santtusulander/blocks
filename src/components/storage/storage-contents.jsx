import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
// UDNP-3205 - Hide HTTP File Upload
// import { Col, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'

import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../button-dropdown'
import Button from '../button'
import IconAdd from '../icons/icon-add'

// UDNP-3205 - Hide HTTP File Upload
// import Toggle from '../toggle'

// eslint-disable-next-line no-unused-vars
const StorageContents = ({ asperaUpload, contents, onMethodToggle, asperaInstanse, gatewayHostname, storageId, brandId, accountId, groupId, fileUploader }) => {
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
        {/*
          // UDNP-3205 - Hide HTTP File Upload
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
        */}
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
        ? <StorageContentBrowser contents={contents} />
        : asperaUpload
        ? <AsperaUpload multiple={true} brandId={brandId} accountId={accountId} groupId={groupId} storageId={storageId} asperaGetaway={gatewayHostname} />
        : <HttpUpload processFiles={processFiles} openFileDialog={openFileDialog} />
      }
    </SectionContainer>
  )
}

StorageContents.displayName = 'StorageContents'

StorageContents.propTypes = {
  accountId: React.PropTypes.string,
  asperaInstanse: PropTypes.instanceOf(Map),
  asperaUpload: PropTypes.bool,
  brandId: React.PropTypes.string,
  contents: PropTypes.array,
  fileUploader: PropTypes.object,
  gatewayHostname: PropTypes.string,
  groupId: PropTypes.string,
  onMethodToggle: PropTypes.func,
  storageId: PropTypes.string
}

export default StorageContents
