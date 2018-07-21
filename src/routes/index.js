const router = require('express').Router()
var AppError = require('express-exception-handler').exception

router.get('/', async (req, res) => {
    res.send("hello cleanly")
})

router.get('/error', async (req, res) => {
        throw new AppError('This is to test error', 400)
})

module.exports = router