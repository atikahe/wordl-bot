const { SlashCommandBuilder } = require('@discordjs/builders')

const { NORMAL, MANIC, LEGEND } = require('../utils/constants')
const messages = require('../utils/messages')
const day = require('../utils/day')

require('dotenv').config()

const capitalizeFirst = (word) => word.replace(/^./, word[0].toUpperCase())

// TODO: Create tile builder function
const tiles = {
    [NORMAL]: '⬛️⬛️⬛️⬛️⬛️\n⬛️⬛️⬛️⬛️⬛️\n⬛️⬛️⬛️⬛️⬛️\n⬛️⬛️⬛️⬛️⬛️\n⬛️⬛️⬛️⬛️⬛️\n⬛️⬛️⬛️⬛️⬛️\n',
}

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
    async execute(interaction, session) {   
        // Check if there is on going game
        const sessionID = `${interaction.guild.id}-${day()}`
        const sessionData = await session.get(sessionID)
        
        const isGameOnGoing = sessionData ? sessionData.find(s => s.active) : false
        
        if (isGameOnGoing) {
            return await interaction.reply(messages.GAME_ONGOING)
        }
        
        // Validate mode
        const mode = interaction.options.getString('mode')
        if (!mode) {
            return await interaction.reply(messages.SELECT_MODE)
        }
        

        const data = sessionData 
            ? sessionData.push({ mode, active: true, guess: [] })
            : [{ mode, active: true, guess: [] }]
        
        await session.set(sessionID, data)
        return await interaction.reply(messages.GAME_STARTED)
    }
}