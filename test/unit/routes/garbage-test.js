jest.mock('../../../src/helpers/toggles', () => ({
    saveToDb: jest.fn()
}))
jest.mock('../../../src/adapters/item', () => ({
    save: jest.fn()
}))

const request = require('./route-initializer')('../../../src/routes/garbage','/garbage'),
    faker =require('faker'),
    toggles = require('../../../src/helpers/toggles'),
    adapter = require('../../../src/adapters/item')

describe('garbage router should', () => {
    beforeEach(() => {
        adapter.save.mockClear()
        toggles.saveToDb.mockReturnValue(true)
    })

    test('if garbage has an Id its accepted', async () => {
        let requestBody = {
            id: faker.random.uuid(),
            other: faker.random.uuid()
        }
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.save).toBeCalledWith(requestBody)
    })

    test('if toggle is off dont call save', async () => {
        let requestBody = {
            id: faker.random.uuid(),
            other: faker.random.uuid()
        }
        toggles.saveToDb.mockReturnValue(false)
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.save).not.toBeCalled()
    })

    test('if garbage has no Id its an error response', async () => {
        let requestBody = {
            other: faker.random.uuid()
        }
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(400)
        expect(result.text).toEqual(JSON.stringify({cause:'Wrong Parameter'}))
    })
})