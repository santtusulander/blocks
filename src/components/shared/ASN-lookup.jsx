import React, { PropTypes, Component } from 'react'
import { reduxForm, Field } from 'redux-form'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'


class ASNLookup extends Component {
  render() {
    return (
      <form>
        <Field
          required={false}
          name="ASNLookup"
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


ASNLookup.displayName = 'ASNLookup'
ASNLookup.propTypes = {

}

const form = reduxForm({
  form: 'ASNLookup'
})(ASNLookup)

module.exports = form
