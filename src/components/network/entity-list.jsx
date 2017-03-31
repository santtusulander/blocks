import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'

import LoadingSpinner from '../loading-spinner/loading-spinner'
import { AccountManagementHeader } from '../account-management/account-management-header'
import NetworkItem from './network-item'
import ContentItemChart from '../content/content-item-chart'

const numericStatusToStringStatus = n => (
  n === 1 ? 'provisioning' : n === 2 ? 'disabled' : n === 3 ? 'enabled' : n === 4 ? 'destroying' : null
)

class EntityList extends React.Component {
  constructor(props) {
    super(props)

    this.renderConnectorLine = this.renderConnectorLine.bind(this)
  }

  componentDidMount() {
    this.entityListItems.addEventListener('scroll', this.renderConnectorLine, false)
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.disableButtons !== nextProps.disableButtons){
      return true
    }
    if (!Immutable.is(nextProps.entities, this.props.entities)) {
      return true
    } else if (nextProps.selectedEntityId !== this.props.selectedEntityId) {
      return true
    } else if (nextProps.starburstData !== this.props.starburstData) {
      return true
    } else if (nextProps.nextEntityList) {
      return true
    } else if (nextProps.fetching !== this.props.fetching) {
      return true
    } else if (nextProps.isParentSelected !== this.props.isParentSelected) {
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
    if (this.hasActiveItems() && !this.props.fetching) {
      // We're modifying DOM elements, so we need to get the correct nodes from entity list
      const childNodes = [...this.entityListItems.childNodes]
      const { nextEntityList } = this.props
      const nextListChildNodes = [...nextEntityList.childNodes]
      // DOM Element of the active element
      const activeChildNode = childNodes.filter(node => node.classList.contains('active'))[0]
      // Active node height divided to half
      const firstOfNextListHeight = nextListChildNodes[0] ? Math.floor(nextListChildNodes[0].offsetHeight / 2) : 0
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

      connectorStyles.top = entityListItems.offsetTop + firstOfNextListHeight + 'px'

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
        connectorStyles.bottom = entityListItems.offsetHeight - firstOfNextListHeight + 'px'
        connectorStyles.top = activeTop - entityListItemsTop + activeHalfHeight + entityListItems.offsetTop - activeChildNode.clientTop + 'px'

        // If the element is scrolled up, we should set the connector line top to
        // be static at the very top of the entity list.
        if (connector.offsetTop <= entityListItems.offsetTop) {
          connectorStyles.top = entityListItems.offsetTop + 'px'
        }
      }
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
      selectedEntityId,
      multiColumn,
      numOfColumns,
      itemsPerColumn,
      showAsStarbursts,
      entityIdKey,
      starburstData,
      params,
      noDataText,
      entities,
      contentTextGenerator,
      titleGenerator,
      isAllowedToConfigure,
      viewPermission
    } = this.props
    if (entities.size && entities.first().get(entityIdKey)) {
      const entityList = entities.map(entity => {
        const entityId = entity.get(entityIdKey)
        const entityName = titleGenerator(entity)
        const isActive = String(selectedEntityId) === String(entity.get(entityIdKey))
        const status = numericStatusToStringStatus(entity.get('status'))
        const contentText = contentTextGenerator(entity)

        let content = (
          <NetworkItem
            key={entityId}
            onEdit={() => editEntity(entityId)}
            title={entityName.toUpperCase()}
            active={isActive}
            content={contentText}
            onSelect={() => selectEntity(entityId)}
            status={status}
            extraClassName="entity-list-item"
            viewPermission={viewPermission}
            />
        )

        if (showAsStarbursts) {
          const dailyTraffic = this.getDailyTraffic(entity)
          const contentMetrics = this.getMetrics(entity)
          const link = starburstData.linkGenerator(entityId)
          const contentItemClasses = classNames('entity-list-item', {
            'active': isActive,
            'is-account': starburstData.type === 'account'
          })

          content = (
            <div
              className={contentItemClasses}
              key={entityId}>

              <ContentItemChart
                chartWidth={starburstData.chartWidth}
                barMaxHeight={starburstData.barMaxHeight}
                name={entityName}
                id={`${starburstData.type}-${entityId}`}
                dailyTraffic={dailyTraffic.get('detail').reverse()}
                primaryData={contentMetrics.get('traffic')}
                secondaryData={contentMetrics.get('historical_traffic')}
                differenceData={contentMetrics.get('historical_variance')}
                cacheHitRate={contentMetrics.get('avg_cache_hit_rate')}
                timeToFirstByte={contentMetrics.get('avg_ttfb')}
                maxTransfer={contentMetrics.getIn(['transfer_rates','peak'], '0.0 Gbps')}
                minTransfer={contentMetrics.getIn(['transfer_rates', 'lowest'], '0.0 Gbps')}
                avgTransfer={contentMetrics.getIn(['transfer_rates', 'average'], '0.0 Gbps')}
                isAllowedToConfigure={isAllowedToConfigure}
                showSlices={true}
                linkTo={link}
                showAnalyticsLink={true}
                onClick={() => selectEntity(entityId)}
                onConfiguration={() => editEntity(entityId)}
                analyticsLink={starburstData.analyticsURLBuilder ? starburstData.analyticsURLBuilder(starburstData.type, entityId, params) : null}
                />
            </div>
          )
        }

        return content
      })

      let content = entityList

      // If the entity column should be a multi-column, we should render
      // additional wrappers divs in order to make separate columns for the
      // items.
      if (multiColumn) {
        // First we chunk our list of elements into segments based on how many
        // items we want to show per column and then render the wrapping divs
        // accordingly.

        // eslint-disable-next-line array-callback-return
        content = this.chunkIntoSegments(entityList, itemsPerColumn).map((col, i) => {
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
    } else if (this.props.isParentSelected) {
      return noDataText
    }
  }

  /**
   * Get metric data for a specific entity. Only used when showing a starburst.
   *
   * @method getMetrics
   * @param  {Immutable.Map}   item Entity to look data for
   * @return {Immutable.Map}        Found data for entity
   */
  getMetrics(item) {
    const { starburstData, entityIdKey } = this.props
    return starburstData.contentMetrics.find(metric => metric.get(starburstData.type) === item.get(entityIdKey),
      null, Immutable.Map({ totalTraffic: 0 }))
  }

  /**
   * Get daily traffic data for a specific entity. Only used when showing a starburst.
   *
   * @method getDailyTraffic
   * @param  {Immutable.Map}        item Entity to look data for
   * @return {Immutable.Map}        Found data for entity
   */
  getDailyTraffic(item) {
    const { starburstData, entityIdKey } = this.props
    return starburstData.dailyTraffic.find(traffic => traffic.get(starburstData.type) === item.get(entityIdKey),
      null, Immutable.fromJS({ detail: [] }))
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
    const { selectedEntityId, entityIdKey, entities } = this.props
    if (entities.size && entities.first().get(entityIdKey)) {
      const active = entities && entities.some(entity =>
        String(selectedEntityId) === String(entity.get(entityIdKey))
      )
      return active
    }
  }

  render() {
    const {
      addEntity,
      creationPermission,
      disableButtons,
      title,
      multiColumn,
      showButtons,
      fetching
    } = this.props

    const entityListClasses = classNames('network-entity-list-items', {
      'multi-column': multiColumn
    })
    return (
      <div
        ref={(ref) => {
          this.entityList = ref
          return this.entityList
        }}
        className="network-entity-list"
      >
        {this.hasActiveItems() &&
          <div
            className="connector-divider"
            ref={(ref) => {
              this.connector = ref
              return this.connector
            }}
          />
        }
        <AccountManagementHeader
          title={title}
          creationPermission={creationPermission}
          onAdd={showButtons ? addEntity : null}
          disableButtons={disableButtons}
        />

        <div
          ref={(ref) => {
            this.entityListItems = ref
            return this.entityListItems
          }}
          className={entityListClasses}
        >
          {fetching ? <LoadingSpinner/> : this.renderListItems()}
        </div>
      </div>
    )
  }
}

EntityList.displayName = 'EntityList'
EntityList.propTypes = {
  addEntity: PropTypes.func.isRequired,
  contentTextGenerator: PropTypes.func,
  creationPermission: PropTypes.string,
  disableButtons: PropTypes.bool,
  editEntity: PropTypes.func.isRequired,
  entities: PropTypes.instanceOf(Immutable.List),
  entityIdKey: PropTypes.string,
  fetching: PropTypes.bool,
  isAllowedToConfigure: PropTypes.bool,
  isParentSelected: PropTypes.bool,
  itemsPerColumn: PropTypes.number,
  multiColumn: PropTypes.bool,
  nextEntityList: PropTypes.object,
  noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  numOfColumns: PropTypes.number,
  params: PropTypes.object,
  selectEntity: PropTypes.func,
  selectedEntityId: PropTypes.string,
  showAsStarbursts: PropTypes.bool,
  showButtons: PropTypes.bool,
  starburstData: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleGenerator: PropTypes.func,
  viewPermission: PropTypes.string
}
EntityList.defaultProps = {
  disableButtons: false,
  entities: Immutable.List(),
  entityIdKey: 'id',
  isAllowedToConfigure: false,
  showButtons: true,
  starburstData: {
    dailyTraffic: Immutable.List(),
    contentMetrics: Immutable.List(),
    barMaxHeight: '30',
    chartWidth: '350'
  },
  contentTextGenerator: () => '',
  titleGenerator: entity => entity.get('name')
}

export default EntityList
