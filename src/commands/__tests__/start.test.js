const Keyv = require('keyv')

const day = require('../../utils/day')
const messages = require('../../utils/messages')

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
                'mode': 'normal',
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }

        // TODO: Mock async storage
        const session = new Keyv()

        const res = await start.execute(interaction, session)
        const activeSession = await session.get(`${interaction.guild.id}-${day()}`)
        
        expect(res).toBe(messages.GAME_STARTED)
        expect(activeSession).toBeDefined()
    }),
    test('Fail when on going game exist', async () => {
        const interaction = {
            'guild': {'id': 1},
            'options': {
                'mode': 'normal',
                getString(str) {
                    return this[str]
                }
            },
            async reply(words) {
                return Promise.resolve(words)
            }
        }
        const session = new Keyv()
        await session.set(
            `${interaction.guild.id}-${day()}`,
            { active: true, id: `${interaction.guild.id}-normal-${day()}` }
        )

        const res = await start.execute(interaction, session)

        expect(res).toBe(messages.GAME_ONGOING)
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

        const res = await start.execute(interaction, session)

        expect(res).toBe(messages.SELECT_MODE)
        expect(session).toBe(session)
    })
})