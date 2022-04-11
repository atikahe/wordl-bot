const {SlashCommandBuilder} = require('@discordjs/builders');

const {GREEN, WHITE, YELLOW, WIN, LOSE} = require('../utils/constants');
const day = require('../utils/day');
const msg = require('../utils/messages');
const tileBuilder = require('../utils/tileBuilder');
// const evaluate = require('../utils/evaluate')
const ModeConfigs = require('../configs/mode.json');

require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
      .setName('guess')
      .setDescription('Guess a word.')
      .addStringOption((option) =>
        option
            .setName('guess')
            .setDescription('Enter your finest guess.')
            .setRequired(true),
      ),
  async execute({interaction, session, staticData}) {
    // Get session data
    const date = new Date().toISOString().split('T')[0];
    const sessionID = `${interaction.guild.id}:${date}`;
    const sessionData = await session.get(sessionID);

    if (!sessionData || !sessionData.active) {
      return await interaction.reply(msg.GAME_NOT_STARTED);
    }

    // Setup mode config
    const {mode, guessesID} = sessionData;
    const {start, wordArr, maxTries} = ModeConfigs.find(
        (conf) => conf.mode === mode,
    );

    // Setup answer
    const index = day(start) - 1;
    const answersArr = await Promise.all(
        wordArr.map(async (arr) => {
          return await staticData.get(arr);
        }),
    );

    // Check if tries < maxTries
    const guesses = await session.get(guessesID);
    if (guesses.length >= maxTries) {
      return await interaction.reply('Out of move!');
    }

    // TODO: Check if word is english
    const guess = interaction.options.getString('guess');
    if (guess.length !== 5) {
      return await interaction.reply(
          `${guess} | ${msg.WORD_LENGTH_INVALID}`,
      );
    }

    // TODO: Put into separate function
    const text = guess.toLowerCase().split('');
    const result = [];
    answersArr.forEach((answers) => {
      const answer = answers[index];
      text.forEach((char, i) => {
        if (answer.indexOf(char) === -1) result.push(WHITE);
        else if (answer[i] === char) result.push(GREEN);
        else result.push(YELLOW);
      });
    });

    // When correct return blocks from previous guesses and hide word
    let reply = '';
    const isCorrect =
            result.filter((color) => color === GREEN).length === guess.length;
    if (isCorrect) {
      reply += `Ya did it ${interaction.user.username}! 🎉\n\n`;
      reply += `Discord Wordle ${index} ${
        guesses.length + 1
      }/${maxTries}\n`;
      guesses.forEach((block) => {
        reply += `${tileBuilder(1, block)}\n`;
      });
      sessionData.active = false;
      sessionData.status = WIN;
      await session.set(sessionID, sessionData);
    }

    // Return the block from current guess
    reply += `${tileBuilder(1, result)} ${
            isCorrect ? '' : guess.toUpperCase()
    }\n`;

    // Add result to stack of answers
    guesses.push(result);
    await session.set(guessesID, guesses);

    // When lose set status
    const isFinished = guesses.length === maxTries;
    if (!isCorrect && isFinished) {
      sessionData.active = false;
      sessionData.status = LOSE;
      await session.set(sessionID, sessionData);
      reply += '\nThis is your last move 😞 Better luck next time!';
    }

    return await interaction.reply(reply);
  },
};
