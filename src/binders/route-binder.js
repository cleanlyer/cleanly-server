function routeBinder(app){
    app.use('/', require('../routes/index'))
}

module.exports = routeBinder
