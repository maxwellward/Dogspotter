const { NEW_USER_ROLE } = require('../../config.json');

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		member.roles.add(NEW_USER_ROLE.value);
	},
};