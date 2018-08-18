jest.mock('../../../src/helpers/toggles', () => ({
    saveToDb: jest.fn()
}))
jest.mock('../../../src/adapters/item', () => ({
    save: jest.fn(),
    update: jest.fn()
}))

const request = require('./route-initializer')('../../../src/routes/garbage','/garbage'),
    faker =require('faker'),
    toggles = require('../../../src/helpers/toggles'),
    adapter = require('../../../src/adapters/item'),
    garbage = require('../../../src/routes/garbage')

describe('garbage create router should', () => {
    beforeEach(() => {
        adapter.save.mockClear()
        toggles.saveToDb.mockReturnValue(true)
        garbage._.table = []
    })

    test('if garbage has an Id its accepted', async () => {
        let requestBody = {
            _id: faker.random.uuid(),
            other: faker.random.uuid()
        }
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.save).toBeCalledWith(requestBody)
        expect(garbage._.table).toEqual([])
    })

    test('if toggle is off dont call save', async () => {
        let requestBody = {
            _id: faker.random.uuid(),
            other: faker.random.uuid()
        }
        toggles.saveToDb.mockReturnValue(false)
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.save).not.toBeCalled()
        expect(garbage._.table).toEqual([requestBody])
    })

})

describe('garbage update router should', () => {
    beforeEach(() => {
        adapter.update.mockClear()
        toggles.saveToDb.mockReturnValue(true)
        garbage._.table = []
    })

    test('if toggle is on call update', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        let result = await request.put(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.update).toBeCalledWith(_id, requestBody)
        expect(garbage._.table).toEqual([])
    })

    test('if toggle is off dont call update', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        garbage._.table = [{_id}]
        toggles.saveToDb.mockReturnValue(false)
        let result = await request.put(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.update).not.toBeCalled()
        expect(garbage._.table).toEqual([requestBody])
    })
})