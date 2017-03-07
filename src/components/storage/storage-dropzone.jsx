import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, FormGroup } from 'react-bootstrap'

import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import AsperaUpload from '../storage/aspera-upload'
import Toggle from '../toggle'
import IconAdd from '../icons/icon-add'

const StorageDropzone = () => {
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
              value={true}
              onText='ON'
              offText='OFF'
              valueChange={() => {}}
            />
          </Col>
        </FormGroup>
        <Button
          className="btn-icon btn-success pull-right"
          bsStyle="success"
          icon={true}
          onClick={() => {}}>
          <IconAdd />
        </Button>
      </SectionHeader>
      <AsperaUpload />
    </SectionContainer>
  )
}

StorageDropzone.displayName = 'StorageDropzone'

export default StorageDropzone
