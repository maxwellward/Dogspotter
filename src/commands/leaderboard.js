const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {
	query, orderBy, limit, collection, getDocs,
} = require('firebase/firestore');
const { db } = require('../util/initFirebase');

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
	const embed = new MessageEmbed()
		.setTitle('Top Dogspotters')
		.setDescription('Who\'s seen the most good doggos?')
		.setFooter({ text: 'Foot' });

	topUsers.forEach(user => {
		embed.addField(`<@${user.id}>`, (user.points).toString());
	});

	interaction.reply({ embeds: [embed] });
}
