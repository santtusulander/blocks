class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domainSearch: '',
      recordSearch: ''
    }
  }
  render() {
    const recordFormProps = {
      domain,
      edit,
      onSave: values => this.editingRecord ? saveRecord(values) : addRecord(values),
      onCancel: () => toggleModal(null)
    }
    <RecordForm
      id="record-form"
      edit={edit}
      domain='foobar.com'
      onSave={values => this.editingRecord ? saveRecord(values) : addRecord(values)}
      onCancel={() => toggleModal(null)}
      {...dnsFormInitialValues}/>}
  }
}
