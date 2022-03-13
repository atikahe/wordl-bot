const c = require('./constants')

module.exports = Object.freeze({
    GAME_STARTED: `The game is afoot! Make your first guess.`,
    GAME_ONGOING: `...finish what you started. Use /guess command followed by a five-lettered word :)`,
    SELECT_MODE: `Select mode first!\n[  ${c.NORMAL}  |  ${c.MANIC}  |  ${c.LEGEND}  ]`
})