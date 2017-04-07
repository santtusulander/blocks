import React from 'react'
import { Pagination } from 'react-bootstrap'

const Paginator = (props) => (
  <div className="text-right udn-pagination">
    <Pagination
      bsSize="small"
      {...props}
    />
  </div>
);

Paginator.displayName = 'Paginator';

export default Paginator;
