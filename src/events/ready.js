module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${client.user.tag} is ready to spot some dogs! (online)`);
	},
};