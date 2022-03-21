const { SlashCommandBuilder } = require('@discordjs/builders')

const { GREEN, WHITE, YELLOW } = require('../utils/constants')
const day = require('../utils/day')
const msg = require('../utils/messages')
const tileBuilder = require('../utils/tileBuilder')

require('dotenv').config()

// TODO: Generate random english words
const ANSWER = ['adieu', 'shown', 'cramp', 'adieu', 'shown', 'cramp', 'adieu', 'shown', 'cramp']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess a word.')
        .addStringOption(option => 
            option.setName('guess')
                .setDescription('Enter your finest guess.')
                .setRequired(true)
        ),
    async execute(interaction, session, static) {        
        const sessionID = `${interaction.guild.id}-${day()}`
        const sessionData = await session.get(sessionID)

        if (!sessionData) {
            return await interaction.reply(msg.GAME_NOT_STARTED)
        }        
        
        const guess = interaction.options.getString('guess')

        // TODO: Check if word is english
        if (guess.length !== 5) {
            return await interaction.reply(msg.WORD_LENGTH_INVALID)
        }

        const answer = ANSWER[day() - 1]
        const text = guess.split('')
        let result = []
        text.forEach((char, i) => {
            if (answer.indexOf(char) === -1) result.push(WHITE)
            else if (answer[i] === char) result.push(GREEN)
            else result.push(YELLOW)
        })
        
        const guesses = await session.get(sessionData.id)
        guesses.push(result)

        await session.set(sessionData.id, guesses)

        let reply = ''
        guesses.forEach(block => {
            reply += `${tileBuilder(1, block)}\n`
        })

        return await interaction.reply(`So you make a guess, big deal. \n${reply}`)
    }
}