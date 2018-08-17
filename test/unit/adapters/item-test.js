jest.mock('mongoose', () =>({
    connect: jest.fn(),
    model: jest.fn(),
    Schema: jest.fn()
}))

const item = require('../../../src/adapters/item'),
    db = require('mongoose'),
    faker = require('faker')

describe('item adapter should', () => {

    beforeEach(() => {
        db.connect.mockClear()
        db.model.mockClear()
    })

    test('initialize should initialize connection', async () => {
        config = require('../../../src/config.json')
        
        item.initialize()

        expect(db.connect).toBeCalledWith(config.mongo.connection)
    })

    test('initialize should export item', async () => {
        let itemSchema = {some: faker.random.uuid()}
        let modelValue = {some: faker.random.uuid()}
        db.Schema.mockImplementation(() => itemSchema)
        db.model.mockReturnValue(modelValue)
        
        item.initialize()

        expect(db.Schema).toBeCalledWith({ 
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
        expect(db.model).toBeCalledWith('items', itemSchema)
        expect(item.models.item).toEqual(modelValue)
    })

    test('save should convert item and save to db', async () => {
        let saveMock = {
            save: jest.fn()
        }
        item.models.item = jest.fn().mockImplementation(() => saveMock)
        let data = { some: faker.random.uuid() }
        item.save(data)
        expect(item.models.item).toBeCalledWith(data)
        expect(saveMock.save).toBeCalled()
    })


})