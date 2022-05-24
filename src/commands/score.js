const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, updateDoc, getDoc,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const { addPointsHistory } = require('../util/historyKeeper');

let action;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('score')
		.setDescription('Change the score of a specific user')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('The user to modify score for')
				.setRequired(true),
		)
		.addNumberOption(option =>
			option.setName('score')
				.setDescription('The amount to change')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('modifier')
				.setDescription('Modifier to apply. Defaults to addition')
				.setRequired(false)
				.addChoices(
					{
						name: 'add',
						value: 'add',
					},
					{
						name: 'subtract',
						value: 'subtract',
					},
					{
						name: 'set',
						value: 'set',
					},
				),
		),
	async execute(interaction) {
		action = interaction;
		modifyScore(interaction.options._hoistedOptions);
	},
};

function modifyScore(options) {
	const user = options[0].user.id;
	const score = options[1].value;
	let modifier;
	try {
		modifier = options[2].value;
	}
	catch (error) {
		modifier = 'add';
	}

	const docRef = doc(db, 'users', user);
	getDoc(docRef)
		.then((document) => {
			let currentPoints;
			if (document.data() == undefined) { currentPoints = 0; }
			else { currentPoints = document.data().points; }
			applyUpdate(user, score, currentPoints, modifier);
		});
}

function applyUpdate(user, scoreToChange, currentPoints, modifier) {
	let score;
	switch (modifier) {
	case 'add':
		score = currentPoints + scoreToChange;
		break;
	case 'subtract':
		score = currentPoints - scoreToChange;
		break;
	case 'set':
		score = scoreToChange;
		break;
	}

	const docRef = doc(db, 'users', user);
	updateDoc(docRef, {
		points: score,
	}).then(() => {
		addPointsHistory(user, action.user.id, modifier, currentPoints, score);
		switch (modifier) {
		case 'add':
			action.reply(`Added ${scoreToChange} points to <@${user}>'s score. New score: ${score}`);
			break;
		case 'subtract':
			action.reply(`Subtracted ${scoreToChange} points from <@${user}>'s score. New score: ${score}`);
			break;
		case 'set':
			action.reply(`Set <@${user}>'s score to ${score}`);
			break;
		}
	})
		.catch((e) => {
			action.reply({ content: 'Something went wrong while trying to perform this action.', ephemeral: true });
			console.log(e);
		});
}