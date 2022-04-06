const squares = {
    'black': '⬛',
    'white': '⬜',
    'green': '🟩',
    'yellow': '🟨'
}

module.exports = (row, colors = []) => {
    if (!colors) {
        colors = new Array(5).fill('black')
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