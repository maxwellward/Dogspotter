const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {
	query, orderBy, limit, collection, getDocs, doc, getDoc,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const client = require('../client');
const { getOrdinalNum, getMonthWord } = require('../util/date');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('See the top dogspotters of all time.'),

	async execute(interaction) {
		calculateLeaderboard(interaction);
	},
};

async function calculateLeaderboard(interaction) {
	const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(5));
	const querySnapshot = await getDocs(q);

	const topUsers = [];

	querySnapshot.forEach((document) => {
		topUsers.push({
			id: document.id,
			points: document.data().points,
		});
	});

	getRequesterPoints(interaction, topUsers);
}

const getRequesterPoints = (interaction, topUsers) => {
	const docRef = doc(db, 'users', interaction.user.id);
	new Promise((resolve) => {
		getDoc(docRef).then((document) => {
			resolve(document.data().points);
		});
	}).then((score) => {
		let plural = 'points';
		if (score == 1) { plural = 'point'; }
		const requesterPoints = `You have ${score} ${plural}.`;
		buildEmbed(interaction, topUsers, requesterPoints);
	});
};

function buildEmbed(interaction, topUsers, requesterPoints) {
	const date = new Date();
	const friendlyDate = `Leaderboard as of ${getMonthWord(date.getMonth())} ${getOrdinalNum(date.getDate())}`;

	const embed = new MessageEmbed()
		.setTitle('Top Dogspotters')
		.setDescription('Who\'s seen the most good doggos?')
		.setFooter({ text: friendlyDate + '. ' + requesterPoints });

	new Promise((resolve) => {
		topUsers.forEach(user => {
			client.users.fetch(user.id).then((userObject) => {
				embed.addField(`${userObject.username}#${userObject.discriminator}`, (user.points).toString());
			});
		});
		resolve();
	}).then(() => {
		interaction.reply({ embeds: [embed] });
	});
}
