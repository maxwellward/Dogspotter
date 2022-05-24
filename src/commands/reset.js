const { SlashCommandBuilder } = require('@discordjs/builders');

let action;

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
		action = interaction;
	},
};