import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as asnActionCreators from '../../redux/modules/asn'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'


class FieldFormGroupAsnLookup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: []
    }

    this.onSearch = this.onSearch.bind(this)
  }

  onSearch(query) {
    if (!query) {
      return;
    }

    const filterType = parseInt(query) ? 'asn' : 'organization'
    this.props.asnActions.fetchAsns({filterBy: filterType, filterValue: query })
      .then(resp => {
        let options = []
        resp.payload.forEach(item => {
          options.push({
            id: item.asn,
            label: `ASN${item.asn} (${item.organization})`
          })
        })

        this.setState({options: options})
      });
  }

  render() {
    return (
      <form>
        <Field
          name="AsnLookup"
          asyncMode={true}
          useCache={false}
          selected={[]}
          component={FieldFormGroupTypeahead}
          multiple={true}
          minLength={1}
          delay={400}
          options={this.state.options}
          label={<FormattedMessage id="portal.common.typeahead.asnLookup.label"/>}
          placeholder={this.props.intl.formatMessage({id: 'portal.common.typeahead.asnLookup.placeholder'})}
          emptyLabel={<FormattedMessage id="portal.common.search.no-results.text"/>}
          onSearch={this.onSearch} />
     </form>
    )
  }
}


FieldFormGroupAsnLookup.displayName = 'FieldFormGroupAsnLookup'
FieldFormGroupAsnLookup.propTypes = {
  asnActions: PropTypes.object,
  intl: PropTypes.object
}

const form = reduxForm({
  form: 'FieldFormGroupAsnLookup'
})(FieldFormGroupAsnLookup)

function mapDispatchToProps(dispatch) {
  return {
    asnActions: bindActionCreators(asnActionCreators, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(injectIntl(form))
