function routeInitializer(depPath, routeBase){
    const exceptionHandler = require('express-exception-handler')
    exceptionHandler.handle()
    const app = require('express')()
    require('../../../src/binders/middleware-binder')(app, true)
    app.use(routeBase, require(depPath))
    app.use(exceptionHandler.middleware)
    return require('supertest')(app)
}

module.exports = routeInitializer