var jsonServer = require('json-server')

var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  "/v2/service_info": "/v2/brands/udn/service_info",
  "/v2/brands/udn/accounts/:account_id/groups/:group_id": "/v2/brands/udn/groups/:group_id",

  "/VCDN/v2/brands/udn/accounts/:account_id/groups/:group_id/published_hosts": "/v2/brands/udn/published_hosts",
  "/VCDN/v2/brands/udn/accounts/:account_id/groups/:group_id/published_hosts/:siteId": "/v2/brands/udn/host_data/1"


}))

server.use(middlewares)
server.use("/v2/brands/udn/", router)

router.render = function (req, res) {

  if (req.url.match(/accounts\/\d+$/i)) {
    res.jsonp(res.locals.data)
  } else
  if (req.url.match(/service_info$/i)) {
    res.jsonp(res.locals.data)
  } else
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
