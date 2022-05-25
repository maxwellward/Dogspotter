const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, getDoc,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const client = require('../index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Get a users current score')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('The user to query')
				.setRequired(true),
		),
	async execute(interaction) {
		const user = interaction.options._hoistedOptions[0];
		getScore(interaction, user);
	},
};

const getScore = (interaction, user) => {
	const id = user.id;
	const docRef = doc(db, 'users', id);
	new Promise((resolve) => {
		getDoc(docRef).then((document) => {
			resolve(document.data().score);
		});
	}).then((score) => {
		let plural = 'points';
		if (score == 1) { plural = 'point'; }
		interaction.reply(`${client.client.users.fetch(id).username} has ${score} ${plural}`);
	});
};