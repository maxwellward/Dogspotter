const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, deleteDoc,
} = require('firebase/firestore');

const { db } = require('../util/initFirebase');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset a users score (IRREVERSIBLE)')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('The user to reset')
				.setRequired(true),
		)
		.addMentionableOption(option =>
			option.setName('confirm')
				.setDescription('Confirm the user to reset')
				.setRequired(true),
		),
	async execute(interaction) {
		if (verifyNameMatch(interaction)) {
			resetScore(interaction);
		}
		else {
			await interaction.reply({ content: 'The two users provided do not match! Please try again.', ephemeral: true });
		}
	},
};

function verifyNameMatch(interaction) {
	const options = interaction.options._hoistedOptions;
	return options[0].user.id == options[1].user.id;
}

function resetScore(interaction) {
	console.log('Reset');
}