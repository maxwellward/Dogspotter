const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {
	query, orderBy, limit, collection, getDocs,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const client = require('../index');
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

	querySnapshot.forEach((doc) => {
		topUsers.push({
			id: doc.id,
			points: doc.data().points,
		});
	});

	buildEmbed(interaction, topUsers);
}

function buildEmbed(interaction, topUsers) {
	const date = new Date();
	const friendlyDate = `Leaderboard as of ${getMonthWord(date.getMonth())} ${getOrdinalNum(date.getDate())}`;

	const embed = new MessageEmbed()
		.setTitle('Top Dogspotters')
		.setDescription('Who\'s seen the most good doggos?')
		.setFooter({ text: friendlyDate });

	new Promise((resolve) => {
		topUsers.forEach(user => {
			client.client.users.fetch(user.id).then((userObject) => {
				embed.addField(`${userObject.username}#${userObject.discriminator}`, (user.points).toString());
			});
		});
		resolve();
	}).then(() => {
		interaction.reply({ embeds: [embed] });
	});
}
