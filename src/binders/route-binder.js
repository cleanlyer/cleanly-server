const express = require('express')
function routeBinder(app){
    app.use('/', require('../routes/index'))
    app.use(express.static('public'))
}

module.exports = routeBinder
