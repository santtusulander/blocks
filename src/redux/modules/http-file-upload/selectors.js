export const getAccessKey = ({ storageAccessToken }) => storageAccessToken

export default (state) => ({
  accessKey: getAccessKey(state)
})
