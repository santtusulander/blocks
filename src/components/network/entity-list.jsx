import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import { AccountManagementHeader } from '../account-management/account-management-header'
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

  /**
   * Does all the rendering calculations for entities and returns a list
   * of elements that will be shown in the container.
   * TODO: This is currently working just with <NetworkItem> components.
   * We'll need to refactor this a bit so it'll also support starbursts and other
   * elements.
   *
   * @method renderListItems
   * @return {Immutable.List}        List of elements that will be rendered
   */
  renderListItems() {
    const {
      editEntity,
      selectEntity,
      deleteEntity,
      selectedEntityId,
      multiColumn,
      numOfColumns,
      itemsPerColumn
    } = this.props

    const entities = this.state.entities.map(entity => {
      const entityId = entity.get('id')
      const entityName = entity.get('name')
      return (
        <NetworkItem
          key={entityId}
          onEdit={() => editEntity(entityId)}
          title={entityName}
          active={selectedEntityId === entityId.toString()}
          onSelect={() => selectEntity(entityId)}
          onDelet={() => deleteEntity(entityId)}
          status="enabled"
          />
      )
    })

    let content = entities

    // If the entity column should be a multi-column, we should render
    // additional wrappers divs in order to make separate columns for the
    // items.
    if (multiColumn) {
      // First we chunk our list of elements into segments based on how many
      // items we want to show per column and then render the wrapping divs
      // accordingly.
      content = this.chunkIntoSegments(entities, itemsPerColumn).map((col, i) => {
        // We only want to show the specified amount of columns.
        if (i < numOfColumns) {
          return (
            <div key={i} className="multi-col">
              {col.map(entity => entity)}
            </div>
          )
        }
      })
    }

    return content
  }

  /**
   * Chunks an Immutable.List to a segments based on the number of items
   * for each segment.
   *
   * @method chunkIntoSegments
   * @param  {Immutable.List}     list       List that needs to be segmented
   * @param  {number}             numOfItems Number of items per segment
   * @return {Immutable.Seq}                 List of segments
   */
  chunkIntoSegments(list, numOfItems) {
    // First we specify the range start (0), the end (list.count()) and how many
    // steps there should be in this range (numOfItems). This will basically give us
    // indexes where we should slice our list, which we're doing afterwards.
    // https://facebook.github.io/immutable-js/docs/#/Range
    return Immutable.Range(0, list.count(), numOfItems).map(chunkStart => list.slice(chunkStart, chunkStart + numOfItems))
  }

  render() {
    const {
      addEntity,
      title,
      multiColumn
    } = this.props

    const {
      showEntitiesTable
    } = this.state



    return (
      <div ref={(ref) => this.entityList = ref} className="network-entity-list">
        <AccountManagementHeader
          title={title}
          onAdd={addEntity}
        />

      <div className={'network-entity-list-items ' + (multiColumn && 'multi-column')}>
          {showEntitiesTable && this.renderListItems()}
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
  itemsPerColumn: PropTypes.number,
  multiColumn: PropTypes.bool,
  numOfColumns: PropTypes.number,
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
