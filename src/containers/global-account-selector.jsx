import React, { PropTypes, Component } from 'react'

import {
  fetchAccountsForModal as fetchAccounts,
  fetchGroupsForModal as fetchGroups,
  fetchPropertiesForModal as fetchHosts } from '../redux/modules/security'

import Menu from '../components/global-account-selector'

class AccountSelector extends Component {
  constructor(props) {
    super(props)

    this.tier = null
    this.account = null
    this.group = null

    this.fetchItems = this.fetchItems.bind(this)
    this.selectOption = this.selectOption.bind(this)
    this.onCaretClick = this.onCaretClick.bind(this)

    this.state = {
      open: false,
      searchValue: '',
      items: []
    }
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)) {
      this.fetchByTier(nextProps.params)
    }
  }

  setInitialTier(params) {
    const { property, group, account, brand } = params
    this.tier = property && 'property' || group && 'group' || account && 'account' || brand && 'brand'
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

  fetchItems(nextTier, ...params) {
    switch(nextTier) {
      case 'property':
        fetchHosts(...params).payload
          .then(res => {
            res && this.setState({ items: res.data.map(item => [item, item]) })
          })
        break
      case 'group':
        fetchGroups(...params).payload
          .then(res => res && this.setState({ items: res.data.map(item => [item.id, item.name]) }))
        break
      case 'brand':
      case 'account':
        fetchAccounts(...params).payload
          .then(res => res && this.setState({ items: res.data.map(item => [item.id, item.name]) }))
        break
    }
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
        this.setState({ open: false })

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
    const { searchValue, items } = this.state
    const itemsToSort = searchValue !== '' ?
      items.filter(item => item[1].toLowerCase().includes(searchValue.toLowerCase())) :
      items
    return itemsToSort.sort((a,b) => {
      if ( a[1].toLowerCase() < b[1].toLowerCase() ) return -1
      if ( a[1].toLowerCase() > b[1].toLowerCase() ) return 1
      return 0
    })
  }

  render() {
    const { searchValue, open } = this.state
    const { topBarTexts, restrictedTo, ...other } = this.props
    const menuProps = Object.assign(other, {
      toggle: () => this.setState({ open: !this.state.open }),
      onSearch: e => this.setState({ searchValue: e.target.value }),
      drillable: restrictedTo && this.tier === restrictedTo || this.tier === 'property' ? false : true,
      items: this.sortedOptions(),
      topBarText: topBarTexts[this.tier],
      onSelect: this.selectOption,
      searchValue,
      open,
      onCaretClick: this.onCaretClick
    })
    return (
      <Menu { ...menuProps }/>
    )
  }
}

AccountSelector.propTypes = {
  fetchItems: PropTypes.func,
  items: PropTypes.array,
  onSelect: PropTypes.func,
  params: PropTypes.object,
  restrictedTo: PropTypes.string,
  topBarAction: PropTypes.func,
  topBarTexts: PropTypes.object
}

export default AccountSelector
