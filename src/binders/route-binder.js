const express = require('express')
function routeBinder(app){
    app.use('/garbage', require('../routes/garbage'))
    app.use(express.static('public'))
}

module.exports = routeBinder
