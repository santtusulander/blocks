import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from '../account-management/account-management-header'
import PageContainer from '../layout/page-container'
import PlaceholderTable from './placeholder-table'

class PlaceholderEntityList extends React.Component {
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
      <PageContainer>
        <AccountManagementHeader
          title={title}
          onAdd={addEntity}
        />

        {showEntitiesTable &&
          <PlaceholderTable
            entities={entities}
            deleteEntity={deleteEntity}
            editEntity={editEntity}
            selectEntity={selectEntity}
            selectedEntityId={selectedEntityId}
          />
        }
      </PageContainer>
    )
  }
}

PlaceholderEntityList.displayName = 'PlaceholderEntityList'
PlaceholderEntityList.propTypes = {
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
PlaceholderEntityList.defaultProps = {
  entities: Immutable.List(),
  entityIdKey: 'id',
  entityNameKey: 'name'
}

export default PlaceholderEntityList
