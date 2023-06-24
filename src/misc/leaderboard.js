const cron = require('node-cron');
const { query, orderBy, limit, collection, getDocs } = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const client = require('../client');
const { LEADERBOARD_CHANNEL } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

let leaderboardChannel;

const startLeaderboardCron = () => {
	if (!LEADERBOARD_CHANNEL.value) {
		console.log('Not starting leaderboard update cron job becasue leaderboard channel isn\t set!');
	}
	else {
		leaderboardChannel = client.channels.cache.get(LEADERBOARD_CHANNEL.value);
		cron.schedule('0 * * * *', () => {
			updateLeaderboard();
		});
		console.log('Started leaderboard update cron job');
	}
};

const getLeaderboard = async () => {
	const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(5));
	const querySnapshot = await getDocs(q);

	const topUsers = [];

	querySnapshot.forEach((document) => {
		topUsers.push({
			id: document.id,
			points: document.data().points,
			username: document.data().username,
		});
	});
	return topUsers;
};

let oldMessage;
const updateLeaderboard = async () => {
	const embed = await buildEmbed(await getLeaderboard());

	if (oldMessage) {
		leaderboardChannel.messages.fetch(oldMessage).then((message) => {
			message.edit({ embeds: [embed] });
		});
	}
	else {
		leaderboardChannel.send({ embeds: [embed] }).then((response) => {
			oldMessage = response.id;
		});
	}


};


const emojis = [':first_place:', ':second_place:', ':third_place:'];
const buildEmbed = async (leaderboard) => {
	const embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215).toString(16))
		.setTitle('Top Dogspotters :trophy:')
		.setDescription('Who\'s seen the most good doggos?')
		.setFooter({ text: 'Leaderboard as of' })
		.setTimestamp(new Date());

	new Promise((resolve) => {
		leaderboard.forEach((user, index) => {
			if (index <= 2) {
				embed.addField(`${emojis[index]} ${user.username}: ${user.points.toString()}`, '‎');
			}
			else {
				embed.addField(`${user.username}: ${user.points.toString()}`, '‎');
			}

		});
		resolve();
	});

	return embed;
};

exports.startLeaderboardCron = startLeaderboardCron;
exports.updateLeaderboard = updateLeaderboard;