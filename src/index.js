const Keyv = require('keyv')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const session = new Keyv()
require('dotenv').config()

session.on('error', err => console.error('Keyv connection error:', err))

client.once('ready', () => {
    console.log(`Beep beep I'm ready! Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commandName === 'ping') {
        await interaction.reply('Pong!')
    } else if (commandName === 'server') {
        await interaction.reply(`Server Info. Name: ${interaction.guild.name}, Members: ${interaction.guild.memberCount}. 😀`)
    } else if (commandName === 'user') {
        await interaction.reply('User Info')
    }
})

client.login(process.env.BOT_TOKEN)