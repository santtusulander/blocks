import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import axios from 'axios'
import { BASE_URL_NORTH } from '../../redux/util'

import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'
import { ASN_STARTING_SEARCH_COUNT, ASN_SEARCH_DELAY, ASN_ITEMS_COUNT_TO_SEARCH } from '../../constants/network'

const fetchAsns = (filterBy, filterValue) =>
  axios.get(`${BASE_URL_NORTH}/asns?filter_by=${filterBy}&filter_value=${filterValue}&page_size=${ASN_ITEMS_COUNT_TO_SEARCH}`)
    .then(res => res ? res.data.data : [])

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
    fetchAsns(filterType, query)
      .then(asns => {
        const options = asns.map(item => ({
          id: item.asn,
          label: `ASN${item.asn} (${item.organization})`
        }))

        this.setState({ options })
      });
  }

  render() {
    return (
      <Field
        name="AsnLookup"
        asyncMode={true}
        useCache={false}
        component={FieldFormGroupTypeahead}
        multiple={true}
        minLength={ASN_STARTING_SEARCH_COUNT}
        delay={ASN_SEARCH_DELAY}
        options={this.state.options}
        label={<FormattedMessage id="portal.common.typeahead.asnLookup.label"/>}
        placeholder={this.props.intl.formatMessage({id: 'portal.common.typeahead.asnLookup.placeholder'})}
        emptyLabel={this.props.intl.formatMessage({id: 'portal.common.search.no-results.text'})}
        onSearch={this.onSearch} />
    )
  }
}


FieldFormGroupAsnLookup.displayName = 'FieldFormGroupAsnLookup'
FieldFormGroupAsnLookup.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(FieldFormGroupAsnLookup)
