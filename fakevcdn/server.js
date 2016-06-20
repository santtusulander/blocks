var jsonServer = require('json-server')

var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  "/accounts/:accountId/groups/:id/published_hosts": "/groups/:id/published_hosts"
}))

server.use(middlewares)
server.use("/VCDN/v2/udn", router)

// Or /resources in general
router.render = function (req, res) {
  res.jsonp({
    data: res.locals.data
  })
}

server.listen(8080, function(){
  console.log('JSON Server is listening on 8080')
})
