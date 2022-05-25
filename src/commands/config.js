const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

let action;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Edit configuration options for Dogspotter'),
	async execute(interaction) {
		action = interaction;
		buildModal();
	},
};

const buildModal = () => {
	const filePath = path.join(__dirname, '/../../config.json');
	const rawdata = fs.readFileSync(filePath);
	const config = JSON.parse(rawdata);

	const modal = new Modal()
		.setCustomId('dogspotter_config')
		.setTitle('Dogspotter Configuration');

	for (const item in config) {
		const configItem = config[item];
		const input = new TextInputComponent()
			.setCustomId(item)
			.setLabel(configItem.label)
			.setStyle(configItem.style)
			.setValue((configItem.value).toString());

		const actionRow = new MessageActionRow().addComponents(input);

		modal.addComponents(actionRow);
	}

	showModal(modal);
};

const showModal = (modal) => {
	action.showModal(modal);
};