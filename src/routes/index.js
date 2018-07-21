const router = require('express').Router()
var AppError = require('express-exception-handler').exception

let something = []

router.post('/garbage', async (req, res) => {
    something.push(req.body)
    res.send(req.body)
})

router.put('/garbage/:id', async (req, res) => {
    res.send(req.body)
})

router.get('/garbage', async (req, res) => {
    res.send(something)
})

module.exports = router