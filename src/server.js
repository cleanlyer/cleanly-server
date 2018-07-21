const express = require('express'),
      middlewareBinder = require('./binders/middleware-binder'),
      port = process.env.PORT || 8080,
      app = express()
 
middlewareBinder(app)

app.listen(port)