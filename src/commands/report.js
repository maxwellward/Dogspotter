const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('report').setDescription('Report an issue with the Dogspotter bot or server.'),
	async execute(interaction) {
		buildModal(interaction);
	},
};

const buildModal = (interaction) => {
	const modal = new Modal().setCustomId('report').setTitle('Report an Issue');
	const issue = new TextInputComponent().setCustomId('issue').setLabel('Describe the Issue').setStyle('PARAGRAPH');
	const issueRow = new MessageActionRow().addComponents(issue);
	modal.addComponents(issueRow);
	interaction.showModal(modal);
};
