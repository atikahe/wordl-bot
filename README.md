# Wordl Bot

Play wordle on your discord server! Inspired Josh Wardle's puzzle game and other variations of it found on the internet.

## How to setup
- Git clone this repository
- Setup token, client id, and guild id variable in env
- ```npm install```
- ```node src/deploy-commands.js```
- And you're ready to go

## How to use bot
Invite this bot to your server. Link will go here.

Use ```/``` as prefix with these commands:
- ```start``` to start a session
- ```guess``` to make a guess

The game will start as ```wordle``` mode by default, the good old-fashioned, one five-lettered word. However in the future we will have ```dordle``` and ```quordle``` mode options to spice up the race.

## How to test
- Use ```npm run test:live``` command to run ```jest --watchAll``` in the background
- Use ```npm run test```command to run the test one time and generate coverage report

## Resources
- [Discord.js](https://discord.js.org/#/)
- [Keyv](https://www.npmjs.com/package/keyv)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Redis](https://redis.io)
