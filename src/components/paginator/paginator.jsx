import React from 'react'
import { Pagination } from 'react-bootstrap'

const Paginator = (props) => (
  <div className="right">
    <Pagination {...props} />
  </div>
);

Paginator.displayName = 'Paginator';

export default Paginator;
