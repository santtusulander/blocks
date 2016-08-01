import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Map, fromJS } from 'immutable'
import axios from 'axios'

import { resetChangedAccount } from '../../redux/modules/account'
import { urlBase } from '../../redux/util'

import Menu from './selector-component.jsx'
import {filterAccountsByUserName} from '../../util/helpers'

const tierHierarchy = [
  'property',
  'group',
  'account',
  'brand'
]

const getAccounts = brand =>
  axios.get(`${urlBase}/v2/brands/${brand}/accounts`)
    .then(res => res && res.data)

const getGroups = (brand, account) =>
  axios.get(`${urlBase}/v2/brands/${brand}/accounts/${account}/groups`)
    .then(res => res && res.data)

const getProperties = (brand, account, group) =>
  axios.get(`${urlBase}/VCDN/v2/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)

class AccountSelector extends Component {
  constructor(props) {
    super(props)

    this.tier = null
    this.account = null
    this.group = null
    this.handleItemListChanging = this.handleItemListChanging.bind(this)
    this.fetchItems = this.fetchItems.bind(this)
    this.selectOption = this.selectOption.bind(this)
    this.onCaretClick = this.onCaretClick.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      open: false,
      searchValue: '',
      items: []
    }
  }

  componentWillMount() {
    this.fetchByTier(this.props.params)
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const { params, getChangedItem } = this.props
    const changedItem = getChangedItem(this.tier)
    let { open } = this.state
    open && this.setState({ open: false })
    if(JSON.stringify(nextProps.params) !== JSON.stringify(params)) {
      this.fetchByTier(nextProps.params)
    } else if(changedItem) {
      this.handleItemListChanging(changedItem.toJS())
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }

  handleItemListChanging({ name, id }) {
    const { items } = this.state
    const indexOfChanged = items.findIndex(item => item[0] === id)
    if(indexOfChanged < 0) {
      items.push([id, name])
    } else if(name) {
      items[indexOfChanged] = [id, name]
    } else {
      items.splice(indexOfChanged, 1)
    }
    this.setState({ items })
  }

  handleClick(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
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

  fetchItems(nextTier, ...params) {
    switch(nextTier) {
      case 'property':
        getProperties(...params)
          .then(res => {
            res && this.setState({ items: res.data.map(item => [item, item]) })
          })
        break
      case 'group':
        getGroups(...params)
          .then(res => res && this.setState({ items: res.data.map(item => [item.id, item.name]) }))
        break
      case 'brand':
      case 'account':
        getAccounts(...params)
          .then(res => {
            if(res && res.data) {
              const filteredAccounts = this.props.user.get('username') ?
                filterAccountsByUserName(
                  fromJS(res.data),
                  this.props.user.get('username')
                ).toJS() :
                res.data
              this.setState({
                items: filteredAccounts.map(item => [item.id, item.name])
              })
            }
          })
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
    const { topBarTexts, resetChanged, getChanged, restrictedTo, ...other } = this.props
    const menuProps = Object.assign(other, {
      toggle: () => this.setState({ open: !this.state.open }),
      onSearch: e => this.setState({ searchValue: e.target.value }),
      drillable: restrictedTo
        && (this.tier === restrictedTo || tierHierarchy.findIndex(tier => tier === restrictedTo) < tierHierarchy.findIndex(tier => tier === this.tier))
        || this.tier === 'property' ? false : true,
      items: this.sortedOptions(),
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
  canGetEdited: PropTypes.string,
  fetchItems: PropTypes.func,
  items: PropTypes.array,
  onSelect: PropTypes.func,
  params: PropTypes.object,
  restrictedTo: PropTypes.string,
  startTier: PropTypes.string,
  topBarAction: PropTypes.func,
  topBarTexts: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}
AccountSelector.defaultProps = {
  user: Map()
}

function mapStateToProps(state) {
  return {
    getChangedItem: tier => {
      switch(tier) {
        case 'brand':
        case 'account': return state.account.get('changedAccount')
      }
    }
  }
}

function mapDispatchToProps(dispatch) {

  return {
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
