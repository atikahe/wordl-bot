const fs = require('node:fs')
const Keyv = require('keyv')
const { Client, Intents, Collection } = require('discord.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const session = new Keyv()

require('dotenv').config()

// Handle keyv error
session.on('error', err => console.error('Keyv connection error:', err))

// Setup commands
client.commands = new Collection()
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    // Set new item in collection {'commandName': commandObject}
    client.commands.set(command.data.name, command)
}

// Establish client connection
client.once('ready', () => {
    console.log(`Beep beep I'm ready! Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction, session)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: `There was an error while executing ${interaction.commandName}`,
            ephemeral: true
        })
    }
})

client.login(process.env.BOT_TOKEN)