const Keyv = require('keyv');

const day = require('../../utils/day');
const msg = require('../../utils/messages');
// const evaluate = require('../../utils/evaluate')
const tileBuilder = require('../../utils/tileBuilder');
const ModeConfigs = require('../../configs/mode.json');
const {LOSE, YELLOW, WIN} = require('../../utils/constants');

const guess = require('../guess');
const messages = require('../../utils/messages');

jest.mock(
    '../../configs/mode.json',
    () => [
      {
        mode: 'wordle',
        maxTries: 6,
        wordArr: ['listA'],
        start: new Date().getTime() / 1000,
      },
    ],
    {virtual: true},
);

// jest.mock('../../utils/evaluate', () => {
//     return jest.fn(() => ['white', 'white', 'white', 'white', 'white'])
// })

jest.mock('../../utils/tileBuilder', () => {
  return jest.fn(() => '⬛⬛⬛⬛⬛');
});

describe('Guess', () => {
  // Static vars
  const date = new Date().toISOString().split('T')[0];
  const wordArr = ['adieu', 'shown', 'cramp', 'weary'];

  // Mongodb data
  const staticData = new Keyv();

  // Redis session
  let index;
  let sessionID;
  let guessesID;
  const session = new Keyv();

  // Discord interaction object
  let interaction = {};

  // Mock mode configurations ??
  let mode;
  let modeConfig;

  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();

    mode = 'wordle';
    modeConfig = ModeConfigs.find((config) => config.mode === mode);
    await staticData.set('listA', wordArr);
    interaction = {
      guild: {id: 1},
      options: {
        guess: 'cramp',
        getString(str) {
          return this[str];
        },
      },
      async reply(words) {
        return Promise.resolve(words);
      },
      user: {
        username: 'janedoe',
      },
    };
    index = day(modeConfig.start);
    sessionID = `${interaction.guild.id}:${date}`;
    guessesID = `${interaction.guild.id}-${mode}-${index}`;
  });

  afterAll(() => {
    session.clear();
    staticData.clear();
  });

  test('Return one-line block and word when guess is incorrect', async () => {
    await session.set(sessionID, {
      active: true,
      guessesID,
      mode,
      status: LOSE,
    });
    await session.set(guessesID, []);

    const res = await guess.execute({interaction, session, staticData});

    expect(res).toEqual(
        expect.stringContaining(interaction.options.guess.toUpperCase()),
    );
    expect(tileBuilder).toHaveBeenCalled();
  });

  test('Return entire guesses block when guess is correct and hide word', async () => {
    interaction.options.guess = 'adieu';
    await session.set(sessionID, {
      active: true,
      guessesID,
      mode,
      status: LOSE,
    });
    await session.set(guessesID, [[YELLOW, YELLOW, YELLOW, YELLOW, YELLOW]]);

    const res = await guess.execute({interaction, session, staticData});
    const sessionData = await session.get(sessionID);

    expect(res).toEqual(
        expect.not.stringContaining(interaction.options.guess.toUpperCase()),
    );
    expect(tileBuilder).toHaveBeenCalled();
    expect(sessionData.active).toBe(false);
    expect(sessionData.status).toBe(WIN);
  });

  test('Failed when game is not started', async () => {
    await session.set(sessionID, {
      active: false,
      guessesID,
      mode,
      status: LOSE,
    });
    const res = await guess.execute({interaction, session, staticData});

    expect(res).toEqual(expect.stringContaining(msg.GAME_NOT_STARTED));
  });

  test('Failed when out of move', async () => {
    await session.set(sessionID, {
      active: true,
      guessesID,
      mode,
      status: LOSE,
    });
    await session.set(
        guessesID,
        new Array(6).fill([YELLOW, YELLOW, YELLOW, YELLOW]),
    );

    const res = await guess.execute({interaction, session, staticData});

    expect(res).toEqual(expect.stringContaining(messages.OUT_OF_MOVE));
  });

  test('Failed word length != 5', async () => {
    interaction.options.guess = 'copy';
    await session.set(sessionID, {
      active: true,
      guessesID,
      mode,
      status: LOSE,
    });
    await session.set(guessesID, [[YELLOW, YELLOW, YELLOW, YELLOW, YELLOW]]);

    const res = await guess.execute({interaction, session, staticData});

    expect(res).toEqual(
        expect.stringContaining(messages.WORD_LENGTH_INVALID),
    );
  });

  test('Set status to lose after maxTries', async () => {
    interaction.options.guess = 'weary';
    await session.set(sessionID, {
      active: true,
      guessesID,
      mode,
      status: LOSE,
    });
    await session.set(
        guessesID,
        new Array(5).fill([YELLOW, YELLOW, YELLOW, YELLOW]),
    );

    const res = await guess.execute({interaction, session, staticData});
    const sessionData = await session.get(sessionID);

    expect(res).toEqual(
        expect.stringContaining(interaction.options.guess.toUpperCase()),
    );
    expect(tileBuilder).toHaveBeenCalled();
    expect(sessionData.active).toBe(false);
    expect(sessionData.status).toBe(LOSE);
  });
});
