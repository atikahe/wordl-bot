const Keyv = require('keyv')

const day = require('../../utils/day')
const messages = require('../../utils/messages')
const { ONGOING, WIN } = require('../../utils/constants')
const ModeConfigs = require('../../configs/mode.json')

const start = require('../start')

describe('Start', () => {
    beforeEach(() => {
        jest.resetModules() // Clears cache
    })

    test('Start new game in a guild', async () => {
        // Mock discord interaction
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': 'wordle',
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()
        const date = new Date().toISOString().split('T')[0]

        const res = await start.execute({interaction, session})
        const activeSession = await session.get(`${interaction.guild.id}:${date}`)
        
        expect(res).toEqual(expect.stringContaining(messages.GAME_STARTED))
        expect(activeSession).toBeDefined()
    }),

    test('Fail when on going game exist', async () => {
        const mode = 'wordle'
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': mode,
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()
        const date = new Date().toISOString().split('T')[0]
        const modeConfig = ModeConfigs.find(config => config.mode === mode)
        const guessesID = `${interaction.guild.id}-${mode}-${day(modeConfig.start)}`

        await session.set(
            `${interaction.guild.id}:${date}`,
            { active: true, guessesID, mode, status: ONGOING }
        )

        const res = await start.execute({interaction, session})

        expect(res).toEqual(expect.stringContaining(messages.GAME_ONGOING))
        expect(session).toBe(session)
    })

    test('Fail when mode is not chosen', async () => {
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': null,
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()

        const res = await start.execute({interaction, session})

        expect(res).toEqual(expect.stringContaining(messages.SELECT_MODE))
        expect(session).toBe(session)
    })

    test('Coming soon message for future modes', async () => {
        const mode = 'quordle'
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': mode,
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()

        const res = await start.execute({interaction, session})

        expect(res).toEqual(expect.stringContaining(messages.COMING_SOON))
    })

    test('Fail when mode is already done', async () => {
        const mode = 'wordle'
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': mode,
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()
        const date = new Date().toISOString().split('T')[0]
        const modeConfig = ModeConfigs.find(config => config.mode === mode)
        const guessesID = `${interaction.guild.id}-${mode}-${day(modeConfig.start)}`
        const sessionID = `${interaction.guild.id}:${date}`

        await session.set(
            sessionID,
            { active: false, guessesID, mode, status: WIN }
        )
        await session.set(guessesID, [])

        const res = await start.execute({interaction, session})

        expect(res).toEqual(expect.stringContaining(messages.GAME_DONE))
        expect(session).toBe(session)
    })
})