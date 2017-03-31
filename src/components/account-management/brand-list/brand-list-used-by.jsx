import React from 'react'

const BrandlistUsedBy = (props) => {
  let content

  if (Array.isArray(props.fieldVal)) {
    return (
      <a>
        {props.fieldVal.length} accounts
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
