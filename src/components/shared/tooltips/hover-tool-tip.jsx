import React from 'react';

const HoverToolTip = (props) => {
  return (
    <span className='hover-tool-tip'>
      <a className='hover-tool-tip-link'>{props.linkText}
        <div className='hover-tool-tip-content'>
            {props.children}
        </div>
      </a>
    </span>
  )
}

HoverToolTip.displayName = 'HoverToolTip'
HoverToolTip.propTypes = {
  children: React.PropTypes.node,
  linkText: React.PropTypes.string
};

module.exports = HoverToolTip
