import React from 'react'
import {
  Input,
  ButtonToolbar,
  Button,
  FormGroup,
  FormControl,
  ControlLabel

  } from 'react-bootstrap'

const EXPORT_TYPE_PDF = 'export_pdf'
const EXPORT_TYPE_CSV = 'export_csv'

const fileTypes = [
  {label: 'PDF', value: EXPORT_TYPE_PDF},
  {label: 'CSV', value: EXPORT_TYPE_CSV},
]

export class ExportFileForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      fileType: props.fileType
    }
  }

  onChange( val ){
    this.setState({fileType: val})
  }

  onDownload(){
    this.props.onDownload(this.state.fileType);
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
              <Input
              key={fileType.value}
              type="radio"
              name="exportFile"
              label={fileType.label}
              checked={fileType.value == this.state.fileType}
              className="export-input-list-item"
              onChange={ () => this.onChange(fileType.value) }
              />
            ))}
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={ () => this.onCancel() }>Cancel</Button>
          <Button type="submit" bsStyle="primary" onClick={ () => this.onDownload(this.state.fileType) } >Download</Button>
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
  onDownload: React.PropTypes.func,
  onCancel: React.PropTypes.func,
}
