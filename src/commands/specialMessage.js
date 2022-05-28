const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

let action;

module.exports = {
	data: new SlashCommandBuilder().setName('specialmessage').setDescription('Send a special message from the Dogspotter account.'),
	async execute(interaction) {
		action = interaction;
		buildModal();
	},
};

const buildModal = () => {
	const modal = new Modal().setCustomId('send_special_message').setTitle('Send Special Message');
	const channel = new TextInputComponent().setCustomId('special_message_channel').setLabel('Channel ID').setStyle('SHORT');
	const message = new TextInputComponent().setCustomId('special_message_input').setLabel('Message').setStyle('PARAGRAPH');
	const channelRow = new MessageActionRow().addComponents(channel);
	const messageRow = new MessageActionRow().addComponents(message);
	modal.addComponents(channelRow, messageRow);
	showModal(modal);
};

const showModal = (modal) => {
	action.showModal(modal);
};
