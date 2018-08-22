jest.mock('../../../src/helpers/toggles', () => ({
    isTestMode: jest.fn()
}))
jest.mock('../../../src/adapters/item', () => ({
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
}))
jest.mock('../../../src/helpers/multer-config', () => ({s3:jest.fn()}))
jest.mock('multer', () => jest.fn().mockImplementation(() => ({single:jest.fn(() => jest.fn())})))

const 
    faker =require('faker'),
    toggles = require('../../../src/helpers/toggles'),
    adapter = require('../../../src/adapters/item'),
    multerConfig = require('../../../src/helpers/multer-config'),
    multer = require('multer')

const multerConfigResult = {some: faker.random.uuid()}
multerConfig.s3.mockReturnValue(multerConfigResult)

const request = require('./route-initializer')('../../../src/routes/garbage','/garbage'),
    garbage = require('../../../src/routes/garbage')

describe('garbage create router should', () => {
    beforeEach(() => {
        adapter.save.mockClear()
        toggles.isTestMode.mockReturnValue(true)
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
        toggles.isTestMode.mockReturnValue(false)
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
        toggles.isTestMode.mockReturnValue(true)
        garbage._.table = []
    })

    test('if toggle is on call update', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        garbage._.table = [{_id}]
        let result = await request.put(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.update).toBeCalledWith(_id, requestBody)
        expect(garbage._.table).toEqual([{_id}])
    })

    test('if toggle is off dont call update', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        garbage._.table = [{_id}]
        toggles.isTestMode.mockReturnValue(false)
        let result = await request.put(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
        expect(adapter.update).not.toBeCalled()
        expect(garbage._.table).toEqual([requestBody])
    })
})

describe('garbage delete router should', () => {
    beforeEach(() => {
        adapter.remove.mockClear()
        toggles.isTestMode.mockReturnValue(true)
        garbage._.table = []
    })

    test('if toggle is on call delete', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        garbage._.table = [{_id}]
        let result = await request.delete(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual("{}")
        expect(adapter.remove).toBeCalledWith(_id)
        expect(garbage._.table).toEqual([{_id}])
    })

    test('if toggle is off dont call delete', async () => {
        let _id = faker.random.uuid(),
            requestBody = {
                _id,
                other: faker.random.uuid()
            }
        garbage._.table = [{_id}]
        toggles.isTestMode.mockReturnValue(false)
        let result = await request.delete(`/garbage/${_id}`).send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual("{}")
        expect(adapter.remove).not.toBeCalled()
        expect(garbage._.table).toEqual([])
    })
})

describe('garbage find router should', () => {
    beforeEach(() => {
        adapter.find.mockClear()
        toggles.isTestMode.mockReturnValue(true)
        garbage._.table = []
    })

    test('if toggle is on call find', async () => {
        let latitude = faker.random.number(100),
            longitude = faker.random.number(100),
            radius = faker.random.number(100),
            _id = faker.random.uuid()

        adapter.find.mockReturnValue([{_id}])
        let result = await request.get(`/garbage/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify([{_id}]))
        expect(adapter.find).toBeCalledWith({coordinates:[latitude,longitude], radius})
        expect(garbage._.table).toEqual([])
    })

    test('if toggle is off dont call find', async () => {
        let latitude = faker.random.number(100),
            longitude = faker.random.number(100),
            radius = faker.random.number(100),
            _id = faker.random.uuid()

        garbage._.table = [{_id}]
        toggles.isTestMode.mockReturnValue(false)
        let result = await request.get(`/garbage/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify([{_id}]))
        expect(adapter.find).not.toBeCalled()
        expect(garbage._.table).toEqual([{_id}])
    })
})
