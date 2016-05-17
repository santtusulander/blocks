import React from 'react'
import {
  Input,
  ButtonToolbar,
  Button,
  FormGroup,
  FormControl,
  ControlLabel

  } from 'react-bootstrap'

const fileTypes = [
  {label: 'PDF', value: 'pdf'},
  {label: 'CSV', value: 'csv'},
]

/*const frequencyOptions = [
    {label: 'One-time, send now', value: 'one-time'},
    {label: 'Weekly', value: 'weekly'},
].map( (e) => {
    return <option value={e.value}>{e.label}</option>;
});*/

const ExportPdfForm = (props) => {
  return (
    <div className='ExportPdfForm'>

      <h4>Select file type</h4>

      <div className="file-types">
            {fileTypes.map((fileType) => (
              <Input key={fileType.value} type="radio" name="exportFile" label={fileType.label}
              className="export-input-list-item"/>
            ))}
      </div>

      <ButtonToolbar className="text-right extra-margin-top">
        <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
        <Button type="submit" bsStyle="primary" onClick={props.onDownload} >Download</Button>
      </ButtonToolbar>

    </div>
  )
}

module.exports = ExportPdfForm
