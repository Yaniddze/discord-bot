import { getServersInfo } from '../handler/index.js';

export default {
	once: true,
	execute(client) {
		client.user.setUsername('Nagachika Hideyoshi');

		client.user.setPresence({
			activities: [{ name: 'Bloodhunt', type: 'COMPETING' }],
			status: 'dnd',
		});

		console.log(`Ready! Logged in as ${client.user.tag}`);

		getServersInfo(client);
	},
};
