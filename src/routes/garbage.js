const router = require('express').Router(),
    multer  = require('multer'),
    upload = multer({ dest: 'public/uploads/'}),
    fs = require('fs'),
    toggles = require('../helpers/toggles'),
    itemsAdapter = require('../adapters/item')

let _ ={
    table: []
}

router.post('/', async (req, res) => {
    if(toggles.isTestMode(req))
        await itemsAdapter.save(req.body)
    else
        _.table.push(req.body)
    res.send(req.body)
})

router.put('/:_id', async (req, res) => {
    if(toggles.isTestMode(req))
        await itemsAdapter.update(req.params._id, req.body)
    else {
        _.table = _.table.filter(element => element._id != req.params._id)
        _.table.push(req.body)
    }
    res.send(req.body)
})

router.delete('/:_id', async (req, res) => {
    if(toggles.isTestMode(req))
        await itemsAdapter.remove(req.params._id)
    else
        _.table = _.table.filter(element => element.id != req.params.id)
    res.send({}) 
})

router.get('/', async (req, res) => {
    let result = _.table
    if(toggles.isTestMode(req)){
        let query = {
            coordinates:[Number.parseFloat(req.query.latitude), Number.parseFloat(req.query.longitude)], 
            radius: Number.parseFloat(req.query.radius)
        }
        result = await itemsAdapter.find(query)
    }
    res.send(result)
})

router.put('/:id/image', upload.single('garbage'), async (req, res) => {
    let garbage = _.table.find(element => element.id = req.params.id)
    fs.rename(req.file.path, `${req.file.path}.png`, function(err) {
        if ( err ) console.log(err)
    })
    garbage.url = `https://rocky-dusk-51136.herokuapp.com/uploads/${req.file.filename}.png`
    res.send(garbage)
})

module.exports = router
module.exports._ = _