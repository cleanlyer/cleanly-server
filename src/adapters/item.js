const db = require('mongoose'),
    connectionString = 'mongodb://localhost/my_database'

const models = {
    item: undefined
}

const initialize = () => {
    db.connect(connectionString)
    models.item = new db.Schema({ 
        location: { 
            type: String, 
            coordinates: [Number] 
        },
        tags: [String]
    })
    db.model('items', models.item)
}

const save = (data) => {}

module.exports = { 
    save, 
    initialize,
    models
}