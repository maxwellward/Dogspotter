const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, getDoc,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Get a users current score')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('The user to query')
				.setRequired(false),
		),
	async execute(interaction) {
		let username;
		let id;

		if (interaction.options._hoistedOptions.length == 0) {
			username = interaction.user.username;
			id = interaction.user.id;
		}
		else {
			const user = interaction.options._hoistedOptions[0];
			username = user.user.username;
			id = user.user.id;
		}
		getScore(interaction, username, id);
	},
};

const getScore = (interaction, username, id) => {
	const docRef = doc(db, 'users', id);
	new Promise((resolve) => {
		getDoc(docRef).then((document) => {
			resolve(document.data().points);
		});
	}).then((score) => {
		let plural = 'points';
		if (score == 1) { plural = 'point'; }
		interaction.reply(`${username} has ${score} ${plural}`);
	});
};