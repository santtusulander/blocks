import React from 'react';

const Dialog = (props) => {
  let className = 'configuration-dialog';
  if (props.className) {
    className = className + ' ' + props.className;
  }

  return (
    <div className={className}>
      <div className="configuration-dialog-gradient" />
      <div className="configuration-dialog-body">
        {props.children}
      </div>
    </div>
  )
}

Dialog.displayName = 'Dialog'
Dialog.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
}

export default Dialog
