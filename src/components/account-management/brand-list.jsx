import React from 'react';

import IconTrash from '../icons/icon-trash.jsx';
import IconAdd from '../icons/icon-add.jsx';

const AVAILABILITY_SHARED = 'Shared';
const AVAILABILITY_PRIVATE = 'Private';

const ActionLinks = (props) => {
  return (
    <div className='actionLinks'>
      <a onClick={ props.onEdit } >Edit</a>
      <a onClick={ props.onDelete } ><IconTrash /></a>
    </div>
  )
}

const BrandListRow = (props) => {
  return (
    <tr className='brandListRow'>
      <td>
        <span className='brandLogoThumb'>
          {props.logo}
        </span>

        {props.brand}
      </td>
      <td>
        {props.availability}
      </td>
      <td>
        {props.lastEdited}
      </td>
      <td>
        {props.usedBy}
      </td>
      <td>
        <ActionLinks onEdit={ () => props.onEdit(props.id) } onDelete={ () => props.onDelete(props.id) }  />
      </td>
    </tr>
  )
}

BrandListRow.propTypes = {
  logo: React.PropTypes.string,
  brand: React.PropTypes.string,
  availability: React.PropTypes.string,
  last_edited: React.PropTypes.string,
  usedBy: React.PropTypes.string,
}

const BrandList = (props) => {

  const tableRows = props.brands.map( (brand, i) => {
    return (
      <BrandListRow key={i} { ... brand } onEdit={props.onEdit} onDelete={props.onDelete}  />
    );
  });

  return (
    <div clasName='brandList'>

      <h3>{props.brands.length} brands <a onClick={props.onAdd}><IconAdd /></a></h3>

      <table className="table table-striped table-analysis">

        <thead>
          <tr>
            <th>Brand</th>
            <th>Availability</th>
            <th>Last Edited</th>
            <th>Used By</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          { tableRows }
        </tbody>

      </table>
    </div>
  )
}

module.exports = {
  ActionLinks,
  BrandList,
  BrandListRow,
  AVAILABILITY_SHARED,
  AVAILABILITY_PRIVATE
};

BrandList.propTypes = {
  brands: React.PropTypes.array
}


