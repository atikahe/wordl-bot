require('dotenv').config()
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies server info'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info'),
].map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

// Set global command
rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID),
        { body: commands }
    )
    .then(() => console.log('Successfully registered commands'))
    .catch(e => console.error(e))