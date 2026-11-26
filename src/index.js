const fs = require('node:fs');
const Keyv = require('keyv');
const KeyvM = require('@keyv/mongo');
const {Client, Collection, GatewayIntentBits, MessageFlags} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  // Never let bot messages ping anyone, even if they echo user input.
  allowedMentions: {parse: []},
});

// Setup mongodb storage
const {MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB} = process.env;
const mongoAuth = `${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASS)}`;
const staticData = new KeyvM(
    `mongodb+srv://${mongoAuth}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`,
);
staticData.on('error', (err) => {
  console.error(`There's a snake in my boots! MongoError: ${err}`);
  process.exit(1);
});

// Setup redis storage
// TLS (rediss://) unless REDIS_TLS=false, e.g. for a local Redis.
const {REDIS_USER, REDIS_PASS, REDIS_HOST, REDIS_PORT, REDIS_TLS} = process.env;
const redisScheme = REDIS_TLS === 'false' ? 'redis' : 'rediss';
const redisAuth = `${encodeURIComponent(REDIS_USER)}:${encodeURIComponent(REDIS_PASS)}`;
const session = new Keyv(
    `${redisScheme}://${redisAuth}@${REDIS_HOST}:${REDIS_PORT}`,
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
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute({interaction, session, staticData});
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `There was an error while executing ${interaction.commandName}`,
      flags: MessageFlags.Ephemeral,
    });
  }
});

client.login(process.env.BOT_TOKEN);
