const router = require('express').Router()
let AppError = require('express-exception-handler').exception
let multer  = require('multer')
let upload = multer({ dest: 'public/uploads/'})
let fs = require('fs')

let table = []

router.post('/garbage', async (req, res) => {
    if(!req.body.id)
        throw new AppError('Wrong Parameter', 400)
    table.push(req.body)
    res.send(req.body)
})

router.put('/garbage/:id', async (req, res) => {
    if(!req.body.id)
        throw new AppError('Wrong Parameter', 400)
    table = table.filter(element => element.id == req.params.id)
    table.push(req.body)
    res.send(req.body)
})

router.delete('/garbage/:id', async (req, res) => {
    if(!req.body.id)
        throw new AppError('Wrong Parameter', 400)
    table = table.filter(element => element.id == req.params.id)
    res.send({})
})

router.put('/garbage/:id/image', upload.single('garbage'), async (req, res) => {
    console.log(req)
    let garbage = table.find(element => element.id = req.params.id)
    fs.rename(req.file.path, `${req.file.path}.png`, function(err) {
        if ( err ) console.log(err)
    });
    garbage.url = `https://rocky-dusk-51136.herokuapp.com/uploads/${req.file.filename}.png`
    res.send(garbage)
})

router.get('/garbage', async (_, res) => {
    res.send(table)
})

module.exports = router