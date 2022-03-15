const tileBuilder = require('../tileBuilder')

describe('Tile Builder', () => {
    test('Build 5 x 6 black tiles', () => {
        const row = 6
        const colors = new Array(5).fill('black')
        const expected = '⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛'

        const res = tileBuilder(row, colors)
        expect(res).toBe(expected)
    })
})