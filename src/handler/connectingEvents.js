import { readdir } from 'fs';

export const connectingEvents = (client) => {
	readdir(`./src/events`, (err, files) => {
		if (err) {
			console.error(err);
		} else {
			files.map(async (file) => {
				const { default: event } = await import(`../events/${file}`);
				const eventName = file.replace('.js', '');

				if (event.once) {
					client.once(eventName, (...args) => event.execute(...args, client));
				} else {
					client.on(eventName, (...args) => event.execute(...args, client));
				}
			});
		}
	});
};
