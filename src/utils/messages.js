const c = require('./constants')

module.exports = Object.freeze({
    GAME_STARTED: `The game is afoot! Make your first guess.`,
    GAME_ONGOING: `...finish what you started. Use /guess command followed by a five-lettered word :)`,
    SELECT_MODE: `Select mode first!\n[  ${c.NORMAL}  |  ${c.MANIC}  |  ${c.LEGEND}  ]`,
    GAME_DONE: 'Easy there.. You did this today. Try again tomorrow.',
    GAME_NOT_STARTED: "Thou haven't started anything yet.",
    WORD_LENGTH_INVALID: "Five characters only!",
    WORD_INVALID: "That's... not english."
})