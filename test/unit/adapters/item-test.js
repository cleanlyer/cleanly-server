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
        },
        expectedResult = faker.random.uuid()
        saveMock.save.mockReturnValue(expectedResult)
        item.models.item = jest.fn().mockImplementation(() => saveMock)
        let data = { some: faker.random.uuid() }
        let result = await item.save(data)
        expect(item.models.item).toBeCalledWith(data)
        expect(saveMock.save).toBeCalled()
        expect(result).toEqual(expectedResult)
    })

    test('update should convert item and save to db', async () => {
        item.models.item = {
            findByIdAndUpdate: jest.fn()
        },
        expectedResult = faker.random.uuid()
        settings = {"new": true, "safe": true, "upsert": true}
        item.models.item.findByIdAndUpdate.mockReturnValue(expectedResult)
        let data = { some: faker.random.uuid() }
        let _id = faker.random.uuid()
        let result = await item.update(_id,data)
        expect(item.models.item.findByIdAndUpdate).toBeCalledWith(_id, data,settings)
        expect(result).toEqual(expectedResult)
    })

    test('delete should remove item from db', async () => {
        item.models.item = {
            findByIdAndDelete: jest.fn()
        }
        let _id = faker.random.uuid()
        await item.remove(_id)
        expect(item.models.item.findByIdAndDelete).toBeCalledWith(_id)
    })

    test('find should do geojson query', async () => {
        let coordinates = [faker.random.number(100), faker.random.number(100)],
            radius = faker.random.number(100),
            query = { 
                location: { 
                    $geoWithin: { 
                        $centerSphere: [ coordinates, radius ] 
                    } 
                } 
            },
            expectedResult = faker.random.uuid()
        item.models.item = {
            find: jest.fn()
        }
        item.models.item.find.mockReturnValue(expectedResult)
        let result = await item.find({ coordinates, radius })
        expect(item.models.item.find).toBeCalledWith(query)
        expect(result).toEqual(result)
    })


})
