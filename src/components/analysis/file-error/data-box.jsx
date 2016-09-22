import React from 'react'

const AnalysisFileErrorDataBox = ({label, code, errs}) =>
  <div className="analysis-data-box">
    <h4 id="label">{label}</h4>
    <p id="code">{code}</p>
    <div className="extra-margin-top">
      {errs.map((summary, i) => {
        return (
          <div className="error-summary" key={i}>
            <p id={"total-" + i} >{summary.value.get('total')}</p>
            <h4>{summary.code}</h4>
          </div>
        )
      })}
    </div>
  </div>

AnalysisFileErrorDataBox.displayName = 'AnalysisFileErrorDataBox'
AnalysisFileErrorDataBox.propTypes = {
  code: React.PropTypes.string,
  errs: React.PropTypes.array,
  label: React.PropTypes.string
}
AnalysisFileErrorDataBox.defaultProps = {
  errs: []
}

export default AnalysisFileErrorDataBox
