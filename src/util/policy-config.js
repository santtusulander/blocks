import { fromJS } from 'immutable'

export const matchFilterChildPaths = {
  'exists': ['cases', 0, 1],
  'contains': ['cases', 0, 1],
  'does_not_exist': ['default'],
  'does_not_contain': ['cases', 1, 1]
}

export function getMatchFilterType(match) {
  if(!match.get('field_detail')) {
    return match.get('default') ? 'does_not_exist' : 'exists'
  }
  if(match.get('default')) {
    return 'does_not_exist'
  }
  if(match.get('cases').size > 1) {
    return 'does_not_contain'
  }
  return match.getIn(['cases', 0, 0]) === '.*' ? 'exists' : 'contains'
}

export function policyContainsMatchField(policy, field, count) {
  const matches = fromJS(policy.matches)
  return matches.filter(match => match.get('field') === field).count() === count
}

export function policyIsCompatibleWithAction(policy, action) {
  switch (action) {
    case 'tokenauth':
      return policy.matches.length === 1
              && policy.sets.length === 1
              && policyContainsMatchField(policy, 'request_url', 1)
  }
  return true
}

export function policyContainsSetComponent(policy, setComponent) {
  const sets = fromJS(policy.sets)
  return sets.filter(set => set.get('setkey') === setComponent).count() > 0
}

export function matchIsContentTargeting(match) {
  return match.get('field') === 'request_host'
          && match.getIn(["cases", 0, 1, 0, "script_lua"])
}

export function parsePolicy(policy, path) {
  // if this is a match
  if(policy && policy.has('match')) {
    const match = policy.get('match')
    const fieldDetail = match.get('field_detail')
    const caseKey = match.getIn(['cases', 0, 0])
    const filterType = getMatchFilterType(match)
    const childPath = matchFilterChildPaths[filterType]
    let {matches, sets} = match.getIn(childPath).reduce((combinations, subcase, i) => {
      // build up a path to the nested rules
      const nextPath = path.concat(['match'], childPath, [i])
      // recurse to parse the nested policy rules
      const {matches, sets} = parsePolicy(subcase, nextPath)
      // add any found matches / sets to the list
      combinations.matches = combinations.matches.concat(matches)
      combinations.sets = combinations.sets.concat(sets)
      return combinations
    }, {matches: [], sets: []})
    // add info about this match to the list of matches
    matches.push({
      containsVal: fieldDetail ? caseKey : '',
      field: match.get('field'),
      fieldDetail: fieldDetail,
      filterType: match.get('field') ? filterType : '',
      values: match.get('cases').map(matchCase => matchCase.get(0)).toJS(),
      path: path.concat(['match'])
    })
    return {
      matches: matches,
      sets: sets
    }
  }
  // if this is a set
  else if(policy && policy.has('set')) {
    // sets are the deepest level, so just return data about the sets
    return {
      matches: [],
      sets: policy.get('set').keySeq().toArray().map((key) => {
        return {
          setkey: key,
          path: path.concat(['set', key])
        }
      })
    }
  }
  else {
    return {
      matches: [],
      sets: []
    }
  }
}
