import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import ActionButtons from '../action-buttons'

const PlaceholderTable = ({ entities, deleteEntity, editEntity, selectEntity, selectedEntityId }) =>
  <table className="table table-striped cell-text-left">
    <tbody>
      {entities.map(entity => {
        const entityId = entity.get('id')
        const entityName = entity.get('name')

        return (
          <tr key={entityId}>
            <td
              onClick={() => selectEntity(entityId)}
              style={{
                cursor: 'pointer',
                fontWeight: `${entityId}` === `${selectedEntityId}` ? 'bold' : 'normal'
              }}
            >{entityName}</td>
            <td width="15%">
              <ActionButtons
                onDelete={() => deleteEntity(entityId)}
                onEdit={() => editEntity(entityId)}
              />
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>

PlaceholderTable.displayName = 'PlaceholderTable'
PlaceholderTable.propTypes = {
  deleteEntity: PropTypes.func.isRequired,
  editEntity: PropTypes.func.isRequired,
  entities: PropTypes.instanceOf(Immutable.List),
  selectEntity: PropTypes.func,
  selectedEntityId: PropTypes.string
}
PlaceholderTable.defaultProps = {
  entities: Immutable.List()
}

export default PlaceholderTable
