import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'

import * as asnActionCreators from '../../redux/modules/asn'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'


class AsnLookup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: []
    }
  }

  componentWillMount() {
    console.log('this.props',this.props)
    this.props.asnActions.fetchAsns({filterBy: 'asn', filterValue: '4' })
  }

  render() {
    return (
      <form>
        <Field
          required={false}
          name="AsnLookup"
          allowNew={true}
          component={FieldFormGroupTypeahead}
          multiple={true}
          options={[]}
          label="Autonomous System Number (ASN)"
          placeholder="Enter ASN or company name" />
     </form>
    )
  }
}


AsnLookup.displayName = 'AsnLookup'
AsnLookup.propTypes = {
  asnActions: PropTypes.object
}

const form = reduxForm({
  form: 'AsnLookup'
})(AsnLookup)

function mapDispatchToProps(dispatch) {
  return {
    asnActions: bindActionCreators(asnActionCreators, dispatch)
  }
}

export default connect(mapDispatchToProps)(form)
