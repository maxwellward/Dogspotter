const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, updateDoc, getDoc,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const { addPointsHistory } = require('../util/historyKeeper');

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
			getCurrentScore(interaction);
		}
		else {
			interaction.reply({ content: 'The two users provided do not match! Please try again.', ephemeral: true });
		}
	},
};

function verifyNameMatch(interaction) {
	const options = interaction.options._hoistedOptions;
	return options[0].user.id == options[1].user.id;
}

function getCurrentScore(interaction) {
	const user = interaction.options._hoistedOptions[0].user.id;
	const docRef = doc(db, 'users', user);
	getDoc(docRef)
		.then((document) => {
			const currentPoints = document.data().points;
			resetScore(interaction, user, currentPoints);
		})
		.catch((e) => {
			console.log(e);
		});
}

function resetScore(interaction, user, currentPoints) {
	const docRef = doc(db, 'users', user);
	updateDoc(docRef, {
		points: 0,
	})
		.then(() => {
			addPointsHistory(user, interaction.user.id, 'reset', currentPoints, 0);
			interaction.reply({ content: `Successfully reset <@${user}>'s score to 0.`, ephemeral: true });
		})
		.catch((e) => {
			interaction.reply({ content: 'Something went wrong while trying to perform this action.', ephemeral: true });
			console.log(e);
		});
}