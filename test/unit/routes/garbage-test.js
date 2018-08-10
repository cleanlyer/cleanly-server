const request = require('./route-initializer')('../../../src/routes/garbage','/'),
    faker =require('faker')

describe('main router should', () => {
    test('if garbage has an Id its accepted', async () => {
        let requestBody = {
            id: faker.random.uuid(),
            other: faker.random.uuid()
        }
        let result = await request.post('/garbage').send(requestBody)
        expect(result.status).toEqual(200)
        expect(result.text).toEqual(JSON.stringify(requestBody))
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