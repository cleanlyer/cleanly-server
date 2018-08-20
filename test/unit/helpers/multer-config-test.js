jest.mock('multer-s3', () =>  jest.fn())
jest.mock('uuid/v1', () =>  jest.fn())
jest.mock('aws-sdk', () =>  ({
    S3: jest.fn()
}))

const multer = require('../../../src/helpers/multer-config'),
    faker = require('faker'),
    multerS3 = require('multer-s3'),
    aws = require('aws-sdk'),
    uuid = require('uuid/v1')  

describe('s3 multer configuration should', () => {
    test('call with correct parameters', async () => {
        multerS3.AUTO_CONTENT_TYPE = faker.random.uuid()
        let expectedResult = faker.random.uuid(),
            awsResult = { some: faker.random.uuid() }
        multerS3.mockReturnValue(expectedResult)
        aws.S3.mockImplementation(() => awsResult)
        let result = multer.s3()
        expect(result).toEqual(expectedResult)
        expect(multerS3).toBeCalledWith({
            s3: awsResult,
            bucket: 'cleanlyer-images',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            storageClass: 'REDUCED_REDUNDANCY',
            cacheControl: 'max-age=31536000',
            key: multer._.keyGenerator
        })
    })

    test('key generator calls cb with guid generated image', async () => {
        let expectedUUID = faker.random.uuid()
        uuid.mockReturnValue(expectedUUID)
        let callback = jest.fn()
        multer._.keyGenerator(undefined,undefined,callback)
        expect(callback).toBeCalledWith(undefined, `${expectedUUID}.jpg`)
    })
})