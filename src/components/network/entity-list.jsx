import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from '../account-management/account-management-header'
import PlaceholderTable from './placeholder-table'
import NetworkItem from './network-item'

class EntityList extends React.Component {
  constructor(props) {
    super(props)

    this.updateEntities = this.updateEntities.bind(this)
    this.state = this.updateEntities(props.entities)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.updateEntities(nextProps.entities))
  }

  shouldComponentUpdate(nextProps) {
    if (!Immutable.is(nextProps.entities, this.props.entities)) {
      return true
    } else if (nextProps.selectedEntityId !== this.props.selectedEntityId) {
      return true
    }

    return false
  }

  updateEntities(entities) {
    const {
      entityIdKey,
      entityNameKey
    } = this.props

    const newEntities = entities.map(entity => Immutable.Map({
      id: entity.get(entityIdKey),
      name: entity.get(entityNameKey)
    }))

    return {
      entities: newEntities,
      showEntitiesTable: newEntities && newEntities.count() > 0
    }
  }

  render() {
    const {
      addEntity,
      deleteEntity,
      editEntity,
      selectEntity,
      selectedEntityId,
      title
    } = this.props

    const {
      entities,
      showEntitiesTable
    } = this.state

    return (
      <div ref={(ref) => this.entityList = ref} className="network-entity-list">
        <AccountManagementHeader
          title={title}
          onAdd={addEntity}
        />

        <div className="network-entity-list-items">
          {showEntitiesTable &&
            entities.map(entity => {
              const entityId = entity.get('id')
              const entityName = entity.get('name')
              return (
                <NetworkItem
                  key={entityId}
                  onEdit={() => editEntity(entityId)}
                  title={entityName}
                  active={selectedEntityId === entityId.toString()}
                  onSelect={() => selectEntity(entityId)}
                  status="enabled"
                  />
              )
            })
          }
        </div>
      </div>
    )
  }
}

EntityList.displayName = 'EntityList'
EntityList.propTypes = {
  addEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
  editEntity: PropTypes.func.isRequired,
  entities: PropTypes.instanceOf(Immutable.List),
  entityIdKey: PropTypes.string,
  entityNameKey: PropTypes.string,
  selectEntity: PropTypes.func,
  selectedEntityId: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}
EntityList.defaultProps = {
  entities: Immutable.List(),
  entityIdKey: 'id',
  entityNameKey: 'name'
}

export default EntityList
