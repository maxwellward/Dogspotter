const { SlashCommandBuilder } = require('@discordjs/builders');

// This works when Dogspotter is run with `pm2 start index`
module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart Dogspotter'),
	async execute(interaction) {
		interaction.reply({ content: 'Restarting Dogspotter. If the bot does not come online, contact <@135169858689171456>', ephemeral: true });
		new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 3000);
		}).then(() => {
			process.exit();
		});
	},
};