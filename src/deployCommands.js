const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config({ path: '../.env' });
const clientId = process.env.CLIENT_ID;
const guildId = process.env.DOGSPOTTER_SERVER;
const token = process.env.TOKEN;

console.log(1);
const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(2);

for (const file of commandFiles) {
	console.log(3);
	const filePath = path.join(commandsPath, file);
	console.log(4);
	console.log(filePath);
	const command = require(filePath);
	console.log(5);
	commands.push(command.data.toJSON());
	console.log(6);
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);