import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'

import { CREATE_ZONE, MODIFY_ZONE } from '../../../constants/permissions'

import IsAllowed from '../../is-allowed'
import UDNButton from '../../button'
import DomainSelector from '../../global-account-selector/selector-component'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain, searchFunc, searchValue }) => {
  const sortedDomains = domains.sort((a,b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1
    if (a.toLowerCase() > b.toLowerCase()) return 1
    return 0
  })
  return (
    <div className="domain-toolbar">
      {domains.length > 0 || searchValue !== '' ?
        <DomainSelector
          items={sortedDomains.map(domain => [domain, domain])}
          onItemClick={changeActiveDomain}
          searchValue={searchValue}
          onSearch={searchFunc}>
           <h3>{activeDomain}<span className="caret"></span></h3>
        </DomainSelector> :
        <h3 className="selector-component">NO DOMAINS</h3>}
      <ButtonToolbar>
        <IsAllowed to={CREATE_ZONE}>
          <UDNButton
            id="add-domain"
            bsStyle="primary"
            icon={true}
            addNew={true}
            onClick={onAddDomain}>
            <IconAdd/>
          </UDNButton>
        </IsAllowed>
        {activeDomain &&
          <IsAllowed to={MODIFY_ZONE}>
            <UDNButton
            id="edit-domain"
            bsStyle="primary"
            icon={true}
            onClick={onEditDomain}>
            <IconEdit/>
          </UDNButton>
        </IsAllowed>}
      </ButtonToolbar>
    </div>
  )
}

DomainToolbar.propTypes = {
  activeDomain: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  domains: PropTypes.array,
  fetchDomains: PropTypes.func,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  searchFunc: PropTypes.func,
  searchValue: PropTypes.string
}

export default DomainToolbar
