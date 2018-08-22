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

const save = async (data) => {
    let item = new models.item(data)
    return await item.save()
}

const update = async (id, data) => {
    return await models.item.findByIdAndUpdate(id, data, {safe: true, upsert: true, new : true})
}

const remove = async (id) => {
    await models.item.findByIdAndDelete(id)
}

const find = async ({coordinates,radius}) => {
    let query = { 
        location: { 
            $geoWithin: { 
                $centerSphere: [ coordinates, radius ] 
            } 
        }
    } 
    return await models.item.find(query)
}

module.exports = { 
    save, 
    update,
    remove,
    find,
    initialize,
    models
}