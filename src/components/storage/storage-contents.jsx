import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Col, FormGroup } from 'react-bootstrap'

import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import AsperaUpload from './aspera-upload'
import StorageContentBrowser from './storage-content-browser'
import ButtonDropdown from '../button-dropdown'
import Toggle from '../toggle'

const StorageContents = ({ asperaUpload, contents, onMethodToggle }) => {
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
          options={[
            {
              label: <FormattedMessage id='portal.storage.summaryPage.contents.newFile.label' />,
              handleClick: () => {}
            },
            {
              label: <FormattedMessage id='portal.storage.summaryPage.contents.newFolder.label' />,
              handleClick: () => {}
            }
          ]}
        />
      </SectionHeader>
      { hasContents
        ?
          <StorageContentBrowser contents={contents} />
        :
          asperaUpload ? <AsperaUpload /> : <span>http-upload</span>
      }
    </SectionContainer>
  )
}

StorageContents.displayName = 'StorageContents'

StorageContents.propTypes = {
  asperaUpload: PropTypes.bool,
  contents: PropTypes.array,
  onMethodToggle: PropTypes.func
}

export default StorageContents
