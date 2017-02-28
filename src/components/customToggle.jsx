import React, {PropTypes} from 'react';

//customize default Dropdown Toggle of react-bootstrap
const CustomToggle = ({ children, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(e);
  }
  return (
    <div className='button-toggle' onClick={handleClick}>
      {children}
    </div>
  )
}

CustomToggle.displayName = 'CustomToggle'

CustomToggle.propTypes = {
  children : PropTypes.node,
  onClick: PropTypes.func
}

export default CustomToggle
