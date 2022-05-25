require('dotenv').config({ path: '../../.env' });
const { DOGSPOTTER_CHANNEL } = require('../../config.json');
module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.channelId != DOGSPOTTER_CHANNEL.value) {
			return;
		}
		checkIfValid(message);
	},
};

function checkIfValid(message) {
	if (message.attachments.size == 0 && message.author.id != process.env.CLIENT_ID) {
		message.delete();
		return false;
	}
	return true;
}