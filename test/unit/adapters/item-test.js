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
        let connection = 'mongodb://localhost/my_database'
        
        item.initialize()

        expect(db.connect).toBeCalledWith(connection)
    })

    test('initialize should export item', async () => {
        let itemSchema = {some: faker.random.uuid()}
        db.Schema.mockImplementation(() => itemSchema)
        
        item.initialize()

        expect(db.Schema).toBeCalledWith({ 
            location: { 
                type: String, 
                coordinates: [Number] 
            },
            tags: [String]
        })
        expect(item.models.item).toEqual(itemSchema)
    })
})