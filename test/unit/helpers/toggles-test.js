const toggles = require('../../../src/helpers/toggles')

describe('toggles should', () => {
    test('isTestMode is active if header test-mode is true', async () => {
        let request = {
            get: jest.fn()
        }
        request.get.mockReturnValue(true)
        expect(toggles.isTestMode(request)).toBeTruthy()
        expect(request.get).toBeCalledWith('test-mode')
    })
    test('isTestMode is inactive if header test-mode is false', async () => {
        let request = {
            get: jest.fn()
        }
        request.get.mockReturnValue(false)
        expect(toggles.isTestMode(request)).toBeFalsy()
        expect(request.get).toBeCalledWith('test-mode')
    })
})