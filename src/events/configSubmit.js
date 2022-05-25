const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isModalSubmit() && !interaction.isButton()) return;

		if (interaction.customId == 'dogspotter_config') {
			updateConfig(interaction);
			return;
		}

		if (interaction.customId == 'restart_button') {
			restartDogspotter(interaction);
			return;
		}


	},
};

const updateConfig = (interaction) => {
	const filePath = path.join(__dirname, '/../../config.json');
	const rawdata = fs.readFileSync(filePath);
	const config = JSON.parse(rawdata);

	interaction.components.forEach(entry => {
		entry = entry.components[0];
		config[entry.customId].value = entry.value;
	});

	fs.writeFileSync(filePath, JSON.stringify(config, null, 4));

	const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('restart_button')
				.setLabel('Restart Dogspotter')
				.setStyle('DANGER'),
		);

	interaction.reply({ content: 'Updated Dogspotter configuration. Changes will not be applied until the bot is restarted.', ephemeral: true, components: [buttons] });
};

// This works when Dogspotter is run with `pm2 start index`
const restartDogspotter = (interaction) => {
	interaction.reply({ content: 'Restarting Dogspotter. If the bot does not come online, contact <@135169858689171456>', ephemeral: true });
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 3000);
	}).then(() => {
		process.exit();
	});
};