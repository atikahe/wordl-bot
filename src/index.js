const { Client, Intents } = require('discord.js')
const internal = require('stream')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

require('dotenv').config()

client.once('ready', () => {
    console.log(`Beep beep I'm ready! Logged in as ${client.user.tag}`)
    console.log(Intents.FLAGS.GUILDS)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    if (interaction.commandName.toLowerCase() === 'ping') {
        await interaction.reply('Pong!')
    }
})

client.login(process.env.BOT_TOKEN)