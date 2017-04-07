import React from 'react'
import { FormattedMessage } from 'react-intl'

const BrandlistUsedBy = (props) => {
  let content

  if (Array.isArray(props.fieldVal)) {
    return (
      <a>
        {props.fieldVal.length} <FormattedMessage id="portal.account.manage.newAccountButton.title" values={{accountsCount: props.fieldVal.length}}/>
      </a>

      /* TODO: create a tooltip
       content = props.fieldVal.map( ( item ) => {
       return (
       <a>{item.accountName}</a>
       )
       }); */

    )
  } else {
    content = props.fieldVal
  }

  return (
    <span>
      {content}
    </span>
  )
}

BrandlistUsedBy.displayName = "BrandlistUsedBy"
BrandlistUsedBy.propTypes = {
  fieldVal: React.PropTypes.object
}

export default BrandlistUsedBy
