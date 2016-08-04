import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'multireducer';
import { Map, List, is } from 'immutable'

import { resetChangedAccount } from '../../redux/modules/account'
import * as accountSelectorActionCreators from '../../redux/modules/account-selector'

import Menu from './selector-component.jsx'

const tierHierarchy = [
  'property',
  'group',
  'account',
  'brand'
]

class AccountSelector extends Component {
  constructor(props) {
    super(props)

    this.tier = null
    this.account = null
    this.group = null
    // this.handleSingleItemChanging = this.handleSingleItemChanging.bind(this)
    this.fetchItems = this.fetchItems.bind(this)
    this.selectOption = this.selectOption.bind(this)
    this.onCaretClick = this.onCaretClick.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      open: false,
      searchValue: ''
    }
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const { params, getChangedItem } = this.props
    const prevChangedItem = getChangedItem(this.tier)
    const nextChangedItem = nextProps.getChangedItem(this.tier)
    const { open } = this.state
    open && this.setState({ open: false })
    if(JSON.stringify(nextProps.params) !== JSON.stringify(params)) {
      this.fetchByTier(nextProps.params)
    }
    else if(nextChangedItem && !is(prevChangedItem, nextChangedItem)) {
      this.handleSingleItemChanging(nextChangedItem.toJS())
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  // handleSingleItemChanging({ name, id, action }) {
  //   const { items } = this.state
  //   const indexOfChanged = items.findIndex(item => item[0] === id)
  //   switch(action) {
  //     case 'delete': items.splice(indexOfChanged, 1)
  //       break
  //     case 'edit': items[indexOfChanged] = [id, name]
  //       break
  //     case 'add': items.push([id, name])
  //   }
  //   this.setState({ items })
  // }

  handleClick(e) {
    if (findDOMNode(this).contains(e.target)) {
      return
    }

    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  setInitialTier(params) {
    const { property, group, account, brand } = params
    this.tier = this.props.startTier || property && 'property' || group && 'group' || account && 'account' || brand && 'brand'
  }

  fetchByTier(params) {
    this.setInitialTier(params)
    const paramArray = Object.keys(params).map(param => {
      this[param] = params[param]
      return params[param]
    })
    this.fetchItems(this.tier, ...paramArray)
  }

  onChange(e) {
    this.setState({ searchValue: e.target.value });
  }

  fetchItems(nextTier, brand, account, group) {
    let fetchParams = []
    switch(nextTier) {
      case 'property':
        fetchParams = [brand, account, group]
        break
      case 'group':
        fetchParams = [brand, account]
        break
      case 'brand':
      case 'account':
        fetchParams = [brand]
        break
    }
    this.props.accountSelectorActions.fetchItems(...fetchParams)
    this.tier = nextTier
  }

  selectOption(e) {
    const { onSelect, topBarAction, params: { brand, account, group, property } } = this.props
    switch(e.target.id) {
      /**
       * Item name pressed -> should route to that item. Since the same menu items are displayed
       * in brand and account tiers, in both cases 'account' gets passed
       */
      case 'name':
      case 'menu-item':
        onSelect(
          this.tier === 'brand' ? 'account' : this.tier,
          e.target.getAttribute('data-value'),
          {
            brand,
            account: this.account || account,
            group: this.group || group
          }
        )
        break
      /**
       * top bar pressed -> calls to function from parent with desired effects
       */
      case 'top-bar':
        topBarAction(
          this.tier,
          this.fetchItems,
          {
            account: this.account || account,
            group: this.group || group,
            property: this.property || property,
            brand
          })
        break
    }
  }

  onCaretClick(e) {
    switch(this.tier) {
      case 'group':
        this.group = e.target.getAttribute('data-value')
        this.fetchItems('property', 'udn', this.account, this.group)
        break
      case 'brand':
      case 'account':
        this.account = e.target.getAttribute('data-value')
        this.fetchItems('group', 'udn', this.account)
        break
    }
  }

  sortedOptions() {
    const { searchValue } = this.state
    const { items } = this.props
    const itemsToSort = searchValue !== '' ?
      items.filter(item => item.get(1).toLowerCase().includes(searchValue.toLowerCase())) :
      items
    return itemsToSort.sort((a,b) => {
      if ( a.get(1).toLowerCase() < b.get(1).toLowerCase() ) return -1
      if ( a.get(1).toLowerCase() > b.get(1).toLowerCase() ) return 1
      return 0
    })
  }

  render() {
    const { searchValue, open } = this.state
    const { topBarTexts, resetChanged, getChangedItem, restrictedTo, ...other } = this.props
    const menuProps = Object.assign(other, {
      toggle: () => {
        getChangedItem(this.tier) !== null && !this.state.open && resetChanged(this.tier)
        this.setState({ open: !this.state.open })
      },
      onSearch: e => this.setState({ searchValue: e.target.value }),
      drillable: restrictedTo
        && (this.tier === restrictedTo || tierHierarchy.findIndex(tier => tier === restrictedTo) < tierHierarchy.findIndex(tier => tier === this.tier))
        || this.tier === 'property' ? false : true,
      items: this.sortedOptions().toJS(),
      topBarText: topBarTexts[this.tier],
      onSelect: this.selectOption,
      searchValue,
      open,
      onCaretClick: this.onCaretClick
    })
    return (
      <Menu {...menuProps}/>
    )
  }
}

AccountSelector.propTypes = {
  accountSelectorActions: PropTypes.object,
  fetchItems: PropTypes.func,
  getChangedItem: PropTypes.func,
  items: React.PropTypes.instanceOf(List),
  onSelect: PropTypes.func,
  params: PropTypes.object,
  resetChanged: PropTypes.func,
  restrictedTo: PropTypes.string,
  startTier: PropTypes.string,
  topBarAction: PropTypes.func,
  topBarTexts: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}
AccountSelector.defaultProps = {
  user: Map()
}

function mapStateToProps(state, {as}) {
  return {
    getChangedItem: tier => {
      switch(tier) {
        case 'brand':
        case 'account': return state.account.get('changedAccount')
      }
    },
    items: state.accountSelectors[as].get('items')
  }
}

function mapDispatchToProps(dispatch, {as}) {

  return {
    accountSelectorActions: bindActionCreators(accountSelectorActionCreators, dispatch, as),
    resetChanged: tier => {
      switch(tier) {
        case 'brand':
        case 'account':
          dispatch(resetChangedAccount())
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector)
