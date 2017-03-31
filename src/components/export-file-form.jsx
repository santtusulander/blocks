import React from 'react'
import {
  FormGroup,
  ControlLabel,
  Radio,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

export const EXPORT_TYPE_PDF = 'export_pdf'
export const EXPORT_TYPE_CSV = 'export_csv'

const fileTypes = [
  { label: 'PDF', value: EXPORT_TYPE_PDF },
  { label: 'CSV', value: EXPORT_TYPE_CSV }
]

class ExportFileForm extends React.Component {
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

        <div className="file-types">
          <FormGroup>
          <ControlLabel>Select file type</ControlLabel>
            {fileTypes.map((fileType, index) => (
              <Radio
                key={`radio-${index}`}
                name="exportFile"
                checked={fileType.value === this.state.fileType}
                className="export-input-list-item"
                onChange={this.onChange(fileType.value)}
              ><span>{fileType.label}</span></Radio>
            ))}
          </FormGroup>
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={this.onCancel}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button type="submit" bsStyle="primary" onClick={this.onDownload(this.state.fileType)}><FormattedMessage id="portal.button.download"/></Button>
        </ButtonToolbar>

      </div>
    )
  }
}

export default ExportFileForm

ExportFileForm.displayName = "ExportFileForm"
ExportFileForm.propTypes = {
  fileType: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onDownload: React.PropTypes.func
}
