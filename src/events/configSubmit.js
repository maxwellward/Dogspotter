const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId != 'dogspotter_config') return;

		updateConfig(interaction);
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

	interaction.reply({ content: 'Updated Dogspotter configuration. Changes will not be applied until the bot is restarted with /restart', ephemeral: true });
};