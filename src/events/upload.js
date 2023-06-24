require('dotenv').config({ path: '../../.env' });
const { detectDogs } = require('../util/dogDetection');
const { DOGSPOTTER_CHANNEL } = require('../../config.json');
const { doc, setDoc, increment } = require('firebase/firestore');
const { db } = require('../util/initFirebase');
const { addScoreHistory } = require('../util/historyKeeper');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.channelId != DOGSPOTTER_CHANNEL.value) {
			return;
		}
		processMessage(message);
	},
};

async function processMessage(message) {
	if (message.author.id == process.env.CLIENT_ID) return;
	message.react('⌛');
	let score = 0;
	if (message.attachments.size == 0) {
		try {
			message.delete();
		}
		catch (e) {
			console.log(e);
		}
		return false;
	}

	const parsedAttachements = message.attachments.map(attachment => {
		return {
			url: attachment.url,
			type: attachment.contentType,
		};
	});

	for (const attachment of parsedAttachements) {
		if (!attachment.type.startsWith('image')) {
			message.delete();
			return false;
		}
		score = score + await detectDogs(attachment.url);
	}
	if (score > 0) updateScore(score, message.author);
	sendResult(score, message, parsedAttachements.length);
	return true;
}

function sendResult(score, message, imageCount) {
	const photoPluralization = imageCount <= 1 ? 'photo' : 'photos';
	const dogPluralization = score == 1 ? 'dog' : 'dogs';
	message.reactions.removeAll();
	if (score == 0) {
		message.reply(`I couldn't find any dogs in your ${photoPluralization} :( If you think this is a mistake, contact a staff member.`);
		message.react('❌');
	}
	else {
		message.reply(`I found ${score} ${dogPluralization} in your ${photoPluralization}! Your score has been updated.`);
		message.react('🐶');
	}
}

function updateScore(score, user) {
	const docRef = doc(db, 'users', user.id);
	setDoc(
		docRef,
		{
			points: increment(score),
			username: user.username,
			id: user.id,
		},
		{ merge: true },
	);
	addScoreHistory(user.id, process.env.CLIENT_ID, 'add_automatic', score);
}