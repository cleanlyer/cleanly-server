const router = require('express').Router()
var AppError = require('express-exception-handler').exception

let something = []
let id = 1

router.post('/garbage', async (req, res) => {
    let formatedData = {
        id: id,
        location: {
            lat: 1.2,
            long: 2.6
        },
    }
    id += 1
    something.push(formatedData)
    res.send(something)
})

router.put('/garbage/:id', async (req, res) => {
    let formatedData = {
        id: id,
        location: {
            lat: 1.2,
            long: 2.6
        },
    }
    id += 1
    something.push(formatedData)
    res.send(something)
})

router.get('/garbage', async (req, res) => {
    res.send(something)
})

module.exports = router