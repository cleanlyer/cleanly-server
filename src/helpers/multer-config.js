const multerS3 = require('multer-s3'),
    aws = require('aws-sdk'),
    uuid = require('uuid/v1')

const keyGenerator = (_, __, callback) => callback(undefined, `${uuid()}.jpg`)

const s3 = () => {
    var s3 = new aws.S3({apiVersion: '2006-03-01', region: 'eu-west-1'})
    return multerS3({
            s3: s3,
            bucket: 'cleanlyer-images',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            storageClass: 'REDUCED_REDUNDANCY',
            cacheControl: 'max-age=31536000',
            key: keyGenerator
        })
}
module.exports = {
    s3,
    _:{
        keyGenerator
    }
}