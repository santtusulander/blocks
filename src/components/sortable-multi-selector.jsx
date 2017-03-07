import React, { PropTypes} from 'react'
import { injectIntl } from 'react-intl'
import {FormGroup, ControlLabel } from 'react-bootstrap';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc'

import ActionButtons from './action-buttons'
import ButtonDropdown from './button-dropdown'

const DragHandle = SortableHandle(() => <div className="sortable-handle">::</div>);

const SortableItem = SortableElement(({value, idx, size, actions}) => {
  const { moveItem, deleteItem } = actions

  return (
    <div className='sortable-item'>
      <DragHandle />
      <div className='sortable-item-name'>
        {value}
      </div>
      <div className='sortable-item-actions'>
        <ActionButtons
          className="secondary"
          onArrowUp={() => {idx > 0 ? moveItem(value, idx, idx - 1) : () => false}}
          arrowUpDisabled={idx <= 0}
          onArrowDown={() => {idx < size - 1 ? moveItem(value, idx, idx + 1) : () => false}}
          arrowDownDisabled={idx >= size - 1}
          onDelete={() => deleteItem(idx)}
        />
      </div>
    </div>
  )
})

const SortableList = SortableContainer(({items, actions}) => {
  return (
    <div className="sortable-list clearfix">
      {items.map((item, i) => 
        <SortableItem
          key={`item-${i}`}
          index={i}
          value={item}
          idx={i}
          size={items.size}
          actions={actions}
        />
      )}
    </div>
  )
})

class SortableMultiSelector extends React.Component {
  constructor(props) {
    super(props)

    this.moveItem = this.moveItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.addItem = this.addItem.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  moveItem(item, oldIndex, newIndex) {
    this.props.onChange(this.props.value.delete(oldIndex).insert(newIndex, item))
  }

  deleteItem(i) {
    this.props.onChange(this.props.value.delete(i))
  }

  addItem(item) {
    this.props.onChange(this.props.value.push(item))
  }

  onSortEnd({oldIndex, newIndex}) {
    let item = this.props.value.get(oldIndex)

    this.props.onChange(this.props.value.delete(oldIndex).insert(newIndex, item))
  }

  render() {
    const { value, options, label, required } = this.props
    const filteredOptions = options
                            .filter(option => !value.contains(option.value))
                            .map(option => Object.assign({}, option, {handleClick: this.addItem}))
    const disableAddItem = () => !filteredOptions.length
    const actions = {
      moveItem: this.moveItem,
      deleteItem: this.deleteItem
    }

    return (
      <FormGroup>
        {label &&
          <ControlLabel>
            {label}{required && ' *'}
          </ControlLabel>
        }
        <div className="pull-right">
          <ButtonDropdown
            bsStyle="primary"
            options={filteredOptions}
            disabled={disableAddItem()}
            pullRight={true}
          />
        </div>

        <SortableList
          items={value}
          onSortEnd={this.onSortEnd}
          actions={actions}
          useDragHandle={true}
          helperClass="sortable-helper"
        />
      </FormGroup>
    )
  }
}

SortableMultiSelector.displayName = 'SortableMultiSelector'
SortableMultiSelector.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  required: PropTypes.bool,
  value: PropTypes.object.isRequired
}
SortableMultiSelector.defaultProps = {
  required: false,
  options: []
}

export default injectIntl(SortableMultiSelector)
