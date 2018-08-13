const router = require('express').Router(),
    AppError = require('express-exception-handler').exception,
    multer  = require('multer'),
    upload = multer({ dest: 'public/uploads/'}),
    fs = require('fs'),
    toggles = require('../helpers/toggles'),
    itemsAdapter = require('../adapters/item')

let table = []

router.post('/', async (req, res) => {
    if(!req.body.id)
        throw new AppError('Wrong Parameter', 400, {cause:'Wrong Parameter'})
    table.push(req.body)
    if(toggles.saveToDb())
        itemsAdapter.save(req.body)
    res.send(req.body)
})

router.put('/:id', async (req, res) => {
    if(!req.body.id)
        throw new AppError('Wrong Parameter', 400)
    table = table.filter(element => element.id != req.params.id)
    table.push(req.body)
    res.send(req.body)
})

router.delete('/:id', async (req, res) => {
    table = table.filter(element => element.id != req.params.id)
    res.send({}) 
})

router.put('/:id/image', upload.single('garbage'), async (req, res) => {
    let garbage = table.find(element => element.id = req.params.id)
    fs.rename(req.file.path, `${req.file.path}.png`, function(err) {
        if ( err ) console.log(err)
    })
    garbage.url = `https://rocky-dusk-51136.herokuapp.com/uploads/${req.file.filename}.png`
    res.send(garbage)
})

router.get('/', async (_, res) => {
    res.send(table)
})

module.exports = router