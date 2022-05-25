require('dotenv').config({ path: '../../.env' });

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		member.roles.add(process.env.NEW_USER_ROLE);
	},
};