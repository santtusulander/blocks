export const genAsyncMock = () => {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => resolve(
        []
      )
    )
  })
}
