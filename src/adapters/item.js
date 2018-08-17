const db = require('mongoose'),
    config = require('../config.json')

const models = {
    item: undefined
}

const initialize = () => {
    db.connect(config.mongo.connection)
    let item  = new db.Schema({ 
        location: { 
            type: { $type: String, default: "Point" }, 
            coordinates: [Number] 
        },
        tags: [String],
        date: { $type: Date, default: Date.now },
        cleaned: { $type: Boolean, default: false },
        block: {$type: Boolean, default: false },
        images: [String]
    }, { typeKey: '$type' })
    models.item = db.model('items', item)
}

const save = (data) => {
    let item = new models.item(data)
    item.save()
}

module.exports = { 
    save, 
    initialize,
    models
}