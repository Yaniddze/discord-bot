import glob from 'glob';
import { parse } from 'path';

export const connectingEvents = (client) => {
	glob('./src/events/**/*.js', (err, files) => {
		if (err) {
			return console.error(err);
		}

		files.map(async (file) => {
			const { default: event } = await import(`../../${file}`);
			const { name: eventName } = parse(file);

			if (event.once) {
				client.once(eventName, (...args) => event.execute(client, ...args));
			} else {
				client.on(eventName, (...args) => event.execute(client, ...args));
			}
		});
	});
};
