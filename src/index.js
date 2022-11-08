const fs = require('node:fs');
const Keyv = require('keyv');
const KeyvM = require('@keyv/mongo');
const {Client, Intents, Collection} = require('discord.js');

require('dotenv').config();

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

// Setup mongodb storage
const {MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB} = process.env;
const staticData = new KeyvM(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`,
);
staticData.on('error', (err) => {
  console.error(`There's a snake in my boots! MongoError: ${err}`);
  process.exit(1);
});

// Setup redis storage
const {REDIS_USER, REDIS_PASS, REDIS_HOST, REDIS_PORT} = process.env;
const session = new Keyv(
    `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`,
);
session.on('error', (err) => {
  console.error(`There's a snake in my boots! RedisError ${err}`);
  process.exit(1);
});

// Setup commands
client.commands = new Collection();
const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set new item in collection {'commandName': commandObject}
  client.commands.set(command.data.name, command);
}

// Establish client connection
client.once('ready', async () => {
  console.log(`Beep beep I'm ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute({interaction, session, staticData});
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `There was an error while executing ${interaction.commandName}`,
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);
