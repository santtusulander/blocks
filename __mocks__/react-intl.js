const reactIntl = jest.genMockFromModule('react-intl')
reactIntl.injectIntl = wrappedClass => wrappedClass
module.exports = reactIntl
