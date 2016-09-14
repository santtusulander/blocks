const reactRedux = jest.genMockFromModule('react-redux')
reactRedux.connect = () => wrappedClass => wrappedClass
module.exports = reactRedux
