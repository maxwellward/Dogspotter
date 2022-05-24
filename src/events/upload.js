require('dotenv').config({ path: '../../.env' });

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.channelId != process.env.DOGSPOTTER_CHANNEL) { return; }
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