const { SlashCommandBuilder } = require('@discordjs/builders')

const { NORMAL, MANIC, LEGEND, ONGOING } = require('../utils/constants')
const messages = require('../utils/messages')
const day = require('../utils/day')
const ModeConfig = require('../configs/mode.json')

const capitalizeFirst = (word) => word.replace(/^./, word[0].toUpperCase())

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts a new game.')
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('Modes of the game.')
                .addChoice(capitalizeFirst(NORMAL), NORMAL)
                .addChoice(capitalizeFirst(MANIC), MANIC)
                .addChoice(capitalizeFirst(LEGEND), LEGEND)
        ),
    async execute({interaction, session}) {
        // Check if there is on going game
        const date = new Date().toISOString().split('T')[0]
        const sessionID = `${interaction.guild.id}:${date}`
        const sessionData = await session.get(sessionID)
        if (sessionData?.active) {
            return await interaction.reply(messages.GAME_ONGOING)
        }


        // Validate mode
        const mode = interaction.options.getString('mode')
        if (!mode) {
            return await interaction.reply(messages.SELECT_MODE)
        }
        if (mode === MANIC || mode === LEGEND) {
            return await interaction.reply(`smtg ${messages.COMING_SOON}`)
        }
        

        // Check if user had done the same mode
        const modeConfig = ModeConfig.find(config => config.mode === mode)
        const index = day(modeConfig.start)
        const guessesID = `${interaction.guild.id}-${mode}-${index}`
        const guessesData = await session.get(guessesID)
        if (guessesData) {
            return await interaction.reply(messages.GAME_DONE)
        }
        
        // TODO: Keep track of winner
        await session.set(sessionID, { active: true, guessesID, mode, status: ONGOING })
        await session.set(guessesID, [])
        return await interaction.reply(messages.GAME_STARTED)
    }
}