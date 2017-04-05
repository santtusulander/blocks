import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'

import SectionContainer from '../shared/layout/section-container'
import SectionHeader from '../shared/layout/section-header'
import AsperaUpload from './aspera-upload'
import HttpUpload from './http-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../shared/form-elements/button-dropdown'
import Button from '../button'
import IconAdd from '../shared/icons/icon-add'

import Toggle from '../shared/form-elements/toggle'

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
  const asperaShowSelectFileDialog = asperaInstanse.get('asperaShowSelectFileDialog') || (() => { /* no-op */ })
  const asperaShowSelectFolderDialog = asperaInstanse.get('asperaShowSelectFolderDialog') || (() => { /* no-op */ })
  const openFileDialog = asperaUpload ? asperaShowSelectFileDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
  const openFolderDialog = asperaUpload ? asperaShowSelectFolderDialog : fileUploader ? fileUploader.openFileDialog : (() => { /* no-op */ })
  const processFiles = fileUploader ? fileUploader.processFiles : (() => { /* no-op */ })

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
