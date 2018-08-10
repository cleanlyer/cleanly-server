const middlewareBinder = require('./binders/middleware-binder'),
      routeBinder = require('./binders/route-binder'),
      port = process.env.PORT || 8080,
      exceptionHandler = require('express-exception-handler')

exceptionHandler.handle()
const app = require('express')()
middlewareBinder(app)
routeBinder(app) 
app.use(exceptionHandler.middleware)

app.listen(port)