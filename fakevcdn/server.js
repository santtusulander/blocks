var jsonServer = require('json-server')

var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  "/VCDN/v2/udn/accounts/:accountId/groups/:id": "/VCDN/v2/udn/groups/:id",
  "/VCDN/v2/udn/accounts/:accountId/groups/:id/published_hosts": "/VCDN/v2/udn/groups/:id/published_hosts",
  "/VCDN/v2/udn/accounts/:accountId/groups/:id/published_hosts/:siteId": "/VCDN/v2/udn/host_data/1"
}))

server.use(middlewares)
server.use("/VCDN/v2/udn", router)

router.render = function (req, res) {

  if (req.url.match(/published_hosts$/i)) {
    res.jsonp(res.locals.data[0].hosts)
  } else {
    if (req.url.match(/host_data/i)) {
      res.jsonp(
        res.locals.data
      )
    } else {
      res.jsonp({
        data: res.locals.data
      })
    }
  }
}

server.listen(8080, function(){
  console.log('JSON Server is listening on 8080')
})
