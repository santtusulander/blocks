const reduxForm = jest.genMockFromModule('redux-form')
reduxForm.reduxForm = () => wrappedClass => wrappedClass
module.exports = reduxForm
