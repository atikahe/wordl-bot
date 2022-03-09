const { SlashCommandBuilder } = require('@discordjs/builders')

require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts a new game! (In normal mode by default)'),
    async execute(interaction, keyv) {   
        const timeDifference = new Date().getTime() - (process.env.START_DAY * 1000)
        const day = Math.ceil(timeDifference / (1000 * 3600 * 24)) 

        const sessionID = `${interaction.guild.id}-normal-${day}`
        await interaction.reply(`Its theoretically started.. Session ID: ${sessionID}`)
    }
}