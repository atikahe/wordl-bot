const { BLACK } = require('./constants')

const squares = {
    'black': '⬛',
    'white': '⬜',
    'green': '🟩',
    'yellow': '🟨'
}

module.exports = (row, colors = false) => {
    if (!colors) {
        colors = new Array(5).fill(BLACK)
    }

    let tiles = ''
    for (let i = 0; i < row; i++) {
        let brick = ''
        colors.forEach(c => {
            brick += squares[c]
        })
        tiles += i == row-1 ? brick : `${brick}\n`
    }

    return tiles
}