import { registeringCommands, getServersInfo } from '../handler/index.js';

export default {
	once: true,
	execute(client) {
		const guild = client.guilds.cache.get(client.config.guildId);
		const botUser = client.user;
		const botMember = guild.members.cache.get(botUser.id);
		const botRole = botMember.roles.cache.first();

		client.config.mainColor = botRole.hexColor;

		botUser.setUsername('Anisutsuri Helper');
		botUser.setPresence({ status: 'dnd' });

		console.log(`Ready! Logged in as ${client.user.tag}`);

		getServersInfo(client);
		registeringCommands(client);
	},
};
