const { SlashCommandBuilder } = require('@discordjs/builders')
const { BLACK, GREEN, WHITE, YELLOW } = require('../utils/constants')
const day = require('../utils/day')

require('dotenv').config()

const ANSWER = ['adieu', 'shown', 'cramp']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess a word.')
        .addStringOption(option => 
            option.setName('guess')
                .setDescription('Enter your finest guess.')
                .setRequired(true)
        ),
    async execute(interaction, session) {        
        const sessionID = `${interaction.guild.id}-${day()}`
        const sessionData = await session.get(sessionID)

        if (!sessionData) {
            await interaction.reply("Thou haven't started anything yet...")
        }
        
        const gameData = sessionData.find(s => s.active)

        const guesses = sessionData.guess
        const guess = interaction.options.getString('guess')
        
        const answer = ANSWER[day() - 1]
        
        let result = []
        const text = guess.split('')
        text.forEach((char, i) => {
            if (answer.indexOf(char) === -1) result.push(BLACK)
            else if (answer[i] === char) result.push(GREEN)
            else result.push(YELLOW)
        })

        // Find better way to operate with k-v
        guesses.push(result)
        gameData.guess = guesses
        sessionData.push(gameData)

        await session.set(sessionID, sessionData)
        await interaction.reply('So you make a guess, big deal.')
    }
}