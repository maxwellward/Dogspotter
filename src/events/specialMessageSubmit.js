const client = require('../client');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isModalSubmit()) return;

		if (interaction.customId == 'send_special_message') {
			sendMessage(interaction);
			return;
		}
	},
};

const sendMessage = (interaction) => {
	const channelID = interaction.components[0].components[0].value;
	const message = interaction.components[1].components[0].value;

	try {
		client.channels.cache.get(channelID).send(message);
	} catch (error) {
		interaction.reply({
			content: `There was an error sending a message to the channel! Please check the ID (${channelID}).`,
			ephemeral: true,
		});
		return;
	}

	interaction.reply({
		content: `Sending special message in <#${channelID}> channel!`,
		ephemeral: true,
	});
};
