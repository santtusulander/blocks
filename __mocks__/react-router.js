const reactRouter = jest.genMockFromModule('react-router')
reactRouter.withRouter = wrappedClass => wrappedClass
module.exports = reactRouter
