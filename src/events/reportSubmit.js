const client = require('../client');
const { ISSUE_CHANNEL } = require('../../config.json');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (!interaction.isModalSubmit()) return;

		if (interaction.customId == 'report') {
			sendReport(interaction);
			return;
		}
	},
};

function sendReport(interaction) {
	const reporter = interaction.user.id;
	const issue = interaction.components[0].components[0].value;
	const issueChannel = ISSUE_CHANNEL.value;

	interaction.reply({
		content: 'Your issue has been sucessfully reported, thank you! If your issue requires a response, you should recieve one within 24-48 hours.',
		ephemeral: true,
	});

	client.channels.fetch(issueChannel).then((channel) => {
		channel.send(`New issue reported by <@${reporter}>: \n\n\`\`\`${issue}\`\`\``);
	});
}
