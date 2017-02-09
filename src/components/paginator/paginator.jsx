import React from 'react'
import { Pagination } from 'react-bootstrap'
import './paginator.scss'

const Paginator = (props) => (
  <div className="right udn-pagination">
    <Pagination
      bsSize="small"
      {...props}
    />
  </div>
);

Paginator.displayName = 'Paginator';

export default Paginator;
