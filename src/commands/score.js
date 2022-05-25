const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	doc, setDoc, increment,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const { addScoreHistory } = require('../util/historyKeeper');

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
		applyUpdate(interaction.options._hoistedOptions);
	},
};

function applyUpdate(options) {
	const user = options[0].user.id;
	let score = options[1].value;
	let modifier;
	try {
		modifier = options[2].value;
	}
	catch (error) {
		modifier = 'add';
	}

	if (modifier == 'subtract') {
		score = -Math.abs(score);
	}

	const docRef = doc(db, 'users', user);
	setDoc(
		docRef,
		{ points: ((modifier == 'set') ? score : increment(score)) },
		{ merge: true },
	).then(() => {
		addScoreHistory(user, action.user.id, modifier, score);
		switch (modifier) {
		case 'add':
			action.reply(`Added ${score} points to <@${user}>'s score.`);
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
			console.log(e);
		});
}