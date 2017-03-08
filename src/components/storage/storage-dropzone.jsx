import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, FormGroup } from 'react-bootstrap'

import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import AsperaUpload from '../storage/aspera-upload'
import ButtonDropdown from '../button-dropdown'
import Toggle from '../toggle'

const StorageDropzone = ({ asperaUpload, onMethodToggle }) => {
  return (
    <SectionContainer>
      <SectionHeader
        sectionHeaderTitle={<FormattedMessage id='portal.storage.summaryPage.dropzone.noFiles.title' />}>
        <FormGroup className="upload-toggle-group">
          <Col className="pull-left">
            <FormattedMessage id='portal.storage.summaryPage.dropzone.asperaToggle.title' />
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
          options={[
            {
              label: <FormattedMessage id='portal.storage.summaryPage.dropzone.newFile.label' />,
              handleClick: () => {}
            },
            {
              label: <FormattedMessage id='portal.storage.summaryPage.dropzone.newFolder.label' />,
              handleClick: () => {}
            }
          ]}
        />
      </SectionHeader>
      { asperaUpload ? <AsperaUpload /> : 'http upload' }
    </SectionContainer>
  )
}

StorageDropzone.displayName = 'StorageDropzone'

StorageDropzone.propTypes = {
  asperaUpload: PropTypes.bool,
  onMethodToggle: PropTypes.func
}

export default StorageDropzone
