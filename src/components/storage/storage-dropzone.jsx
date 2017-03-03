import React from 'react'
import { FormattedMessage } from 'react-intl'

import SectionContainer from '../../components/layout/section-container'
import SectionHeader from '../../components/layout/section-header'
import AsperaUpload from '../../components/storage/aspera-upload'

const StorageDropzone = () => {
  return (
    <SectionContainer>
      <SectionHeader
        sectionHeaderTitle={<FormattedMessage id='portal.storage.summaryPage.dropzone.noFiles.title' />} />
      <AsperaUpload />
    </SectionContainer>
  )
}

StorageDropzone.displayName = 'StorageDropzone'

export default StorageDropzone
