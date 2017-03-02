import React, { PropTypes} from 'react'
import { injectIntl, intlShape } from 'react-intl'
import ActionButtons from './action-buttons'
import ButtonDropdown from './button-dropdown'

class SortableMultiSelector extends React.Component {
  constructor(props) {
    super(props)

    this.renderItem = this.renderItem.bind(this)
    this.moveItem = this.moveItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.showOptions = this.showOptions.bind(this)
  }

  moveItem(item, prevIndex, index) {
    this.props.onChange(this.props.value.delete(prevIndex).insert(index, item))
  }

  deleteItem(i) {
    this.props.onChange(this.props.value.delete(i))
  }

  addItem(item) {
    this.props.onChange(this.props.value.push(item))
  }

  renderItem(item, i, size) {
    return (
      <div
        key={i}
        className={'clearfix'}
      >
        <div>
          <p>
            {item}
          </p>
        </div>
        <div className="text-right">
          <ActionButtons
            className="secondary"
            onArrowUp={() => i > 0 ? this.moveItem(item, i, i - 1) : () => false}
            arrowUpDisabled={i <= 0}
            onArrowDown={() => i < size - 1 ? this.moveItem(item, i, i + 1) : () => false}
            arrowDownDisabled={i >= size - 1}
            onDelete={() => this.deleteItem(i)} 
          />
        </div>
      </div>
    )
  }
  

  render() {
    const { value, options } = this.props
    const filteredOptions = options.filter(option => !value.contains(option))
    const disableAddItem = () => !filteredOptions.length

    return (
      <div>
        <div>
          <ButtonDropdown
            options={filteredOptions}
            disabled={disableAddItem()}
            pullRight={true}
          />
        </div>
        <div>
          {value.map((item, i) => {
            return this.renderItem(item, i, value.size)
          })}
        </div>
      </div>
    )
  }
}

SortableMultiSelector.displayName = 'SortableMultiSelector'
SortableMultiSelector.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  options: PropTypes.array
}
SortableMultiSelector.defaultProps = {
  disabled: false,
  options: []
}

export default injectIntl(SortableMultiSelector)