import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'

import { AccountManagementHeader } from '../account-management/account-management-header'
import NetworkItem from './network-item'

class EntityList extends React.Component {
  constructor(props) {
    super(props)

    this.networkItem = null

    this.updateEntities = this.updateEntities.bind(this)
    this.state = this.updateEntities(props.entities)
    this.renderConnectorLine = this.renderConnectorLine.bind(this)
  }

  componentDidMount() {
    this.entityListItems.addEventListener('scroll', this.renderConnectorLine, false)
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

  componentDidUpdate() {
    this.renderConnectorLine()
  }

  componentWillUnmount() {
    this.entityListItems.removeEventListener('scroll', this.renderConnectorLine, false)
  }

  /**
   * Renders the blue vertical connecting line on the right side of the entity list. This is
   * called when the user scrolls the list and when the component is updated in order
   * to get the correct height calculations.
   *
   * @method renderConnectorLine
   */
  renderConnectorLine() {
    // Check if this entity list has an active item
    if (this.hasActiveItems()) {
      // We're modifying DOM elements, so we need to get the correct nodes from entity list
      const childNodes = [...this.entityListItems.childNodes]
      // DOM Element of the active element
      const activeChildNode = childNodes.filter(node => node.classList.contains('active'))[0]
      // Active node height divided to half
      const activeHalfHeight = Math.floor(activeChildNode.offsetHeight / 2)
      const activeNodeSizes = activeChildNode.getBoundingClientRect()
      const activeTop = activeNodeSizes.top
      const activeBottom = activeNodeSizes.bottom
      // DOM Element for the vertical connector line
      const connector = this.connector
      const connectorStyles = connector.style

      // Container, the root element of this component
      const entityList = this.entityList
      const entityListSizes = entityList.getBoundingClientRect()
      const entityListBottom = entityListSizes.bottom

      // The actual entity list
      const entityListItems = this.entityListItems
      const entityListItemsSizes = entityListItems.getBoundingClientRect()
      const entityListItemsTop = entityListItemsSizes.top
      const entityListItemsBottom = entityListItemsSizes.bottom
      const entityListItemsBottomOffset = entityListBottom - entityListItemsBottom

      // Checks if the active item is visible in the viewport by half of its height
      const topHalfVisibility = activeTop >= entityListItemsTop - activeHalfHeight
      const bottomHalfVisibility = activeBottom <= entityListItemsBottom + activeHalfHeight
      const isVisible = topHalfVisibility && bottomHalfVisibility

      connectorStyles.top = entityListItems.offsetTop + activeHalfHeight + 'px'

      // If active item is visible by half, we should set the bottom style to be
      // where the right side tick on the element ends. Otherwise we should set it
      // to be at the end of the entity list.
      if (isVisible) {
        connectorStyles.bottom = entityListItemsTop + entityListItems.offsetHeight - activeTop - activeHalfHeight + entityListItemsBottomOffset + 'px'
      } else {
        // This bottom value is mainly applied when the active item is scrolled down
        // in the list.
        connectorStyles.bottom = entityListItemsBottomOffset + 'px'
      }

      // If the active item is scrolled to the top, we should switch the top and bottom
      // calculations so that the vertical connecting line grows accordingly.
      if (activeTop < entityListItemsTop) {
        connectorStyles.bottom = entityListItems.offsetHeight - activeHalfHeight + 'px'
        connectorStyles.top = activeTop - entityListItemsTop + activeHalfHeight + entityListItems.offsetTop - activeChildNode.clientTop + 'px'

        // If the element is scrolled up, we should set the connector line top to
        // be static at the very top of the entity list.
        if (connector.offsetTop <= entityListItems.offsetTop) {
          connectorStyles.top = entityListItems.offsetTop + 'px'
        }
      }
    }
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
            <div key={i} className="list-col">
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

  /**
   * Checks if any of the entities in the list is selected.
   *
   * @method hasActiveItems
   * @return {Boolean}      Boolean of active item found
   */
  hasActiveItems() {
    const { selectedEntityId } = this.props
    const entities = this.state.entities
    const active = entities.some(entity => selectedEntityId === entity.get('id').toString())
    return active
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

    const entityListClasses = classNames('network-entity-list-items', {
      'multi-column': multiColumn
    })

    return (
      <div ref={ref => this.entityList = ref} className="network-entity-list">
        {(showEntitiesTable && this.hasActiveItems()) && <div ref={ref => this.connector = ref} className="connector-divider"/>}
        <AccountManagementHeader
          title={title}
          onAdd={addEntity}
        />

      <div ref={ref => this.entityListItems = ref} className={entityListClasses}>
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
