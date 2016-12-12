import React from 'react'
import {
  FormGroup,
  ControlLabel,
  Radio,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

const EXPORT_TYPE_PDF = 'export_pdf'
const EXPORT_TYPE_CSV = 'export_csv'

const fileTypes = [
  { label: 'PDF', value: EXPORT_TYPE_PDF },
  { label: 'CSV', value: EXPORT_TYPE_CSV }
]

export class ExportFileForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      fileType: props.fileType
    }

    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onDownload = this.onDownload.bind(this)
  }

  onChange( val ){
    return () => {
      this.setState({fileType: val})
    }
  }

  onDownload( fileType ){
    return () => {
      this.props.onDownload(fileType);
    }
  }

  onCancel(){
    this.props.onCancel();
  }

  render() {
    return (
      <div className='ExportFileForm'>

        <h4>Select file type</h4>

        <div className="file-types">
          {fileTypes.map((fileType) => (
            <FormGroup key={`radio-${fileType.value}`}>
              <ControlLabel>{fileType.label}</ControlLabel>
              <Radio
                name="exportFile"
                checked={fileType.value == this.state.fileType}
                className="export-input-list-item"
                onChange={this.onChange(fileType.value)}
              />
            </FormGroup>
          ))}
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={this.onCancel}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button type="submit" bsStyle="primary" onClick={this.onDownload(this.state.fileType)}><FormattedMessage id="portal.button.download"/></Button>
        </ButtonToolbar>

      </div>
    )
  }
}

module.exports = {
  ExportFileForm,
  EXPORT_TYPE_PDF,
  EXPORT_TYPE_CSV
}

ExportFileForm.propTypes = {
  fileType: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onDownload: React.PropTypes.func
}
