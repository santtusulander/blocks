module.exports = {
  "num_errors": {
    "e404": {
      "http": 1,
      "https": 2,
      "total": 3
    },
    "e500": {
      "http": 3,
      "https": 1,
      "total": 4
    }
  },
  "url_details": [
    {
      "status_code": "404",
      "url": "idean.com/a.png",
      "bytes": 1848238,
      "requests": 17498,
      "service_type": "http"
    },
    {
      "status_code": "500",
      "url": "idean.com/c.png",
      "bytes": 1559828,
      "requests": 14815,
      "service_type": "http"
    },
    {
      "status_code": "404",
      "url": "idean.com/b.png",
      "bytes": 1538539,
      "requests": 15949,
      "service_type": "https"
    },
    {
      "status_code": "500",
      "url": "idean.com/d.png",
      "bytes": 1428522,
      "requests": 19554,
      "service_type": "http"
    },
    {
      "status_code": "500",
      "url": "idean.com/a.png",
      "bytes": 95490,
      "requests": 650,
      "service_type": "https"
    },
    {
      "status_code": "404",
      "url": "idean.com/a.png",
      "bytes": 31740,
      "requests": 254,
      "service_type": "https"
    },
    {
      "status_code": "500",
      "url": "idean.com/a.png",
      "bytes": 1344,
      "requests": 114,
      "service_type": "http"
    }
  ]
}
