import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Button } from 'react-bootstrap'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../shared/form-fields/field-form-group'
import IconFolder from '../shared/icons/icon-folder'

import { FormattedMessage, injectIntl } from 'react-intl'

const NewFolder = ({ onSave, onClose, invalid, handleSubmit, intl }) => {

  return (
    <form className="storage-content-folder-creator" onSubmit={handleSubmit(onSave)}>
      <IconFolder className='storage-contents-icon' />
      <Field
        type="text"
        name="folderName"
        className="folder-name"
        placeholder={intl.formatMessage({id: 'portal.storage.summaryPage.contentBrowser.newFolder.text'})}
        component={FieldFormGroup}
      />
      <div className="form-buttons">
        <Button
          className="cancel-btn btn-secondary"
          onClick={onClose}
        >
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button
          type="submit"
          bsStyle="primary"
          disabled={invalid}
        >
          <FormattedMessage id="portal.button.save" />
        </Button>
      </div>
    </form>
  )
}
NewFolder.displayName = "NewFolder"
NewFolder.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  ...reduxFormPropTypes
}

export default connect()(
  reduxForm({ form: 'storageNewFolder' })
  (injectIntl(NewFolder)))
