require('dotenv').config({ path: '../../.env' });

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (message.channelId != process.env.DOGSPOTTER_CHANNEL) { return; }
		checkIfImage(message);
	},
};

function checkIfImage(message) {
	if (message.attachments.size == 0) {
		message.delete();
	}
}