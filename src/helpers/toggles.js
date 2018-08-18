const isTestMode = (req) => {
    return req.get('test-mode')
}

module.exports = { isTestMode }