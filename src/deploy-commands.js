const fs = require('node:fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

require('dotenv').config();

const commands = [];
const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(process.env.BOT_TOKEN);

// Set global command
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands})
    .then(() => console.log('Successfully registered commands'))
    .catch((e) => console.error(e));
