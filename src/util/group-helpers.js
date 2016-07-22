
/**
 * Turns the given group list to a CheckboxArray compatible option list (iterable).
 * @param {List} groups
 * @returns {Array}
 */
export function getOptions(groups) {
  let options = []

  groups.forEach(group => {
    options.push({
      value: group.get('id'),
      label: group.get('name')
    })
  })

  return options
}
