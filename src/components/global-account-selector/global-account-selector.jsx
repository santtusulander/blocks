import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'multireducer';
import { Map, List, is } from 'immutable'

import { resetChangedAccount } from '../../redux/modules/account'
import * as accountSelectorActionCreators from '../../redux/modules/account-selector'
import * as PERMISSIONS from '../../constants/permissions.js'
import checkPermissions from '../../util/permissions'

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
    this.onCaretClick = this.onCaretClick.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this.onTopbarClick = this.onTopbarClick.bind(this)
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    const { params, getChangedItem } = this.props
    const prevChangedItem = getChangedItem(this.tier)
    const nextChangedItem = nextProps.getChangedItem(this.tier)
    if(JSON.stringify(nextProps.params) !== JSON.stringify(params) ||
      (nextChangedItem && !is(prevChangedItem, nextChangedItem))) {
      this.fetchByTier(nextProps.params)
      this.props.accountSelectorActions.setOpen(false)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  canSeeAccounts() {
    return checkPermissions(
      this.props.roles,
      this.props.currentUser,
      PERMISSIONS.VIEW_CONTENT_ACCOUNTS
    )
  }

  setInitialTier(params) {
    const { property, group, account, brand } = params
    let initTier = this.props.startTier || property && 'property' ||
      group && 'group' || account && 'account' || brand && 'brand'
    if(!this.canSeeAccounts() && (initTier === 'account' || initTier === 'brand')) {
      initTier = 'group'
    }
    this.tier = initTier
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
    if(!this.canSeeAccounts() && (nextTier === 'account' || nextTier === 'brand')) {
      nextTier = 'group'
    }
    if(!this.canSeeAccounts() && !account) {
      account = this.props.currentUser.get('account_id')
    }
    if(nextTier === 'property') {
      fetchParams = [brand, account, group]
    }
    else if(nextTier === 'group') {
      fetchParams = [brand, account]
    }
    this.props.accountSelectorActions.fetchItems(...fetchParams).then(() => {
      this.props.accountSelectorActions.setSearch('')
    })
    this.tier = nextTier
  }

  /**
   * Item name pressed -> should route to that item. Since the same menu items are displayed
   * in brand and account tiers, in both cases 'account' gets passed
   */
  onItemClick(value) {
    let { onSelect, params: { brand, account, group }, accountSelectorActions } = this.props
    if(!this.canSeeAccounts() && !account) {
      account = this.props.currentUser.get('account_id')
    }
    this.props.accountSelectorActions.setOpen(false)
    accountSelectorActions.setSearch('')
    onSelect(
      this.tier === 'brand' ? 'account' : this.tier,
      value,
      {
        brand,
        account: this.account || account,
        group: this.group || group
      }
    )
  }

   /**
    * top bar pressed -> calls to function from parent with desired effects
    */
  onTopbarClick() {
    let { topBarAction, params: { brand, account, group, property } } = this.props
    if(!this.canSeeAccounts() && !account) {
      account = this.props.currentUser.get('account_id')
    }
    topBarAction(
      this.tier,
      this.fetchItems,
      {
        account: this.account || account,
        group: this.group || group,
        property: this.property || property,
        brand
      }
    )
  }

  onCaretClick(value) {
    let fetchArgs;
    if(this.tier === 'group') {
      this.group = value
      fetchArgs = ['property', 'udn', this.account, this.group]
    }
    else {
      this.account = value
      fetchArgs = ['group', 'udn', this.account]
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
    const topBarText = this.tier === 'group' && !this.canSeeAccounts() ? '' : topBarTexts[this.tier]
    const menuProps = Object.assign(other, {
      close: () => this.props.accountSelectorActions.setOpen(false),
      toggle: () => {
        getChangedItem(this.tier) !== null && !open && resetChanged(this.tier)
        accountSelectorActions.setOpen(!open)
      },
      onSearch: e => accountSelectorActions.setSearch(e.target.value),
      drillable: restrictedTo
        && (this.tier === restrictedTo || tierHierarchy.findIndex(tier => tier === restrictedTo) < tierHierarchy.findIndex(tier => tier === this.tier))
        || this.tier === 'property' ? false : true,
      items: this.sortedOptions().toJS(),
      topBarText: topBarText,
      onSelect: this.selectOption,
      searchValue,
      open,
      onItemClick: this.onItemClick,
      onTopbarClick: this.onTopbarClick,
      onCaretClick: this.onCaretClick
    })
    return (
      <Menu {...menuProps}/>
    )
  }
}

AccountSelector.propTypes = {
  accountSelectorActions: PropTypes.object,
  currentUser: React.PropTypes.instanceOf(Map),
  fetchItems: PropTypes.func,
  getChangedItem: PropTypes.func,
  items: React.PropTypes.instanceOf(List),
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  params: PropTypes.object,
  resetChanged: PropTypes.func,
  restrictedTo: PropTypes.string,
  roles: React.PropTypes.instanceOf(List),
  searchValue: PropTypes.string,
  startTier: PropTypes.string,
  topBarAction: PropTypes.func,
  topBarTexts: PropTypes.object
}
AccountSelector.defaultProps = {
  items: List(),
  roles: List(),
  currentUser: Map()
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
    roles: state.roles.get('roles'),
    searchValue: accountSelector.get('searchValue'),
    currentUser: state.user.get('currentUser')
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
