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
    this.fetchItems = this.fetchItems.bind(this)
    this.selectOption = this.selectOption.bind(this)
    this.onCaretClick = this.onCaretClick.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const { params, getChangedItem } = this.props
    const prevChangedItem = getChangedItem(this.tier)
    const nextChangedItem = nextProps.getChangedItem(this.tier)
    if(JSON.stringify(nextProps.params) !== JSON.stringify(params) ||
      (nextChangedItem && !is(prevChangedItem, nextChangedItem))) {
      this.fetchByTier(nextProps.params)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  handleClick(e) {
    if (findDOMNode(this).contains(e.target)) {
      return
    }

    if (this.props.open) {
      this.props.accountSelectorActions.setOpen(false)
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

  fetchItems(nextTier, brand, account, group) {
    let fetchParams = [brand]
    if(nextTier === 'property') {
      fetchParams = [brand, account, group]
    }
    else if(nextTier === 'group') {
      fetchParams = [brand, account]
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
    let fetchArgs = ['group', 'udn', this.account]
    if(this.tier === 'group') {
      this.group = e.target.getAttribute('data-value')
      fetchArgs.push(this.group)
    }
    else {
      this.account = e.target.getAttribute('data-value')
    }
    this.fetchItems(...fetchArgs)
  }

  sortedOptions() {
    const searchValue = this.props.searchValue.toLowerCase()
    const itemsToSort = searchValue !== '' ?
      this.props.items.filter(item => item.get(1).toLowerCase().includes(searchValue)) :
      this.props.items
    return itemsToSort.sort((a,b) => {
      const aLower = a.get(1).toLowerCase()
      const bLower = b.get(1).toLowerCase()
      if ( aLower < bLower ) return -1
      if ( aLower > bLower ) return 1
      return 0
    })
  }

  render() {
    const { topBarTexts, resetChanged, getChangedItem, restrictedTo, open, searchValue, accountSelectorActions, ...other } = this.props
    const menuProps = Object.assign(other, {
      toggle: () => {
        getChangedItem(this.tier) !== null && !open && resetChanged(this.tier)
        accountSelectorActions.setOpen(!open)
      },
      onSearch: e => accountSelectorActions.setSearch(e.target.value),
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
  open: PropTypes.bool,
  params: PropTypes.object,
  resetChanged: PropTypes.func,
  restrictedTo: PropTypes.string,
  searchValue: PropTypes.string,
  startTier: PropTypes.string,
  topBarAction: PropTypes.func,
  topBarTexts: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}
AccountSelector.defaultProps = {
  items: List(),
  user: Map()
}

function mapStateToProps(state, {as}) {
  const accountSelector = state.accountSelectors[as]
  return {
    getChangedItem: tier => {
      switch(tier) {
        case 'brand':
        case 'account': return state.account.get('changedAccount')
      }
    },
    items: accountSelector.get('items'),
    open: accountSelector.get('open'),
    searchValue: accountSelector.get('searchValue')
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
