import React from 'react'

class Purge extends React.Component {
  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this)
  }
  submitForm() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Purge</h1>

      </div>
    );
  }
}

Purge.displayName = 'Purge'
Purge.propTypes = {}

module.exports = Purge
