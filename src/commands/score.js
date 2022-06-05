const { SlashCommandBuilder } = require('@discordjs/builders');
const { doc, setDoc, increment } = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const { addScoreHistory } = require('../util/historyKeeper');
const { POINT_MULTIPLIER } = require('../../config.json');

let action;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('score')
		.setDescription('Change the score of a specific user')
		.addMentionableOption((option) => option.setName('user').setDescription('The user to modify score for').setRequired(true))
		.addNumberOption((option) => option.setName('score').setDescription('The amount to change').setRequired(true))
		.addStringOption((option) =>
			option.setName('modifier').setDescription('Modifier to apply. Defaults to addition').setRequired(false).addChoices(
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
				}
			)
		),
	async execute(interaction) {
		action = interaction;
		applyUpdate(interaction.options._hoistedOptions);
	},
};

function applyUpdate(options) {
	const name = options[0].user.username + '#' + options[0].user.discriminator;
	const user = options[0].user.id;
	let score = options[1].value;
	let modifier;
	try {
		modifier = options[2].value;
	} catch (error) {
		modifier = 'add';
	}

	if (modifier == 'subtract') {
		score = -Math.abs(score);
	} else if (modifier == 'add') {
		let multiplier = 1;
		try {
			multiplier = parseInt(POINT_MULTIPLIER.value);
		} catch (error) {
			action.reply({ content: 'Could not parse point multiplier to a number. Please check the config.', ephemeral: true });
			return;
		}
		score = score * multiplier;
	}

	const docRef = doc(db, 'users', user);
	setDoc(
		docRef,
		{
			points: modifier == 'set' ? score : increment(score),
			username: name,
		},
		{ merge: true }
	)
		.then(() => {
			addScoreHistory(user, action.user.id, modifier, score);
			const multiplier = Math.round(POINT_MULTIPLIER.value);
			switch (modifier) {
				case 'add':
					if (multiplier != 1) {
						action.reply(`Added ${score * multiplier} points to <@${user}>'s score (${multiplier}x point multiplier).`);
					} else {
						action.reply(`Added ${score} points to <@${user}>'s score.`);
					}
					break;
				case 'subtract':
					action.reply(`Subtracted ${Math.abs(score)} points from <@${user}>'s score.`);
					break;
				case 'set':
					action.reply(`Set <@${user}>'s score to ${score}`);
					break;
			}
		})
		.catch((e) => {
			action.reply({ content: 'Something went wrong while trying to perform this action.', ephemeral: true });
			console.error(e);
		});
}
