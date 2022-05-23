const { Client, Intents } = require('discord.js');
require('dotenv').config({ path: '../.env' });

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Dogspotter is ready to spot!');
});

client.login(process.env.TOKEN);