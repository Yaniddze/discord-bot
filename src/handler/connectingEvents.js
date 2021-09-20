import glob from 'glob';
import { parse } from 'path';

export const connectingEvents = (client) => {
	glob('./src/events/**/*.js', (err, files) => {
		if (err) {
			console.error(err);
		} else {
			files.map(async (file) => {
				const { default: event } = await import(`../../${file}`);
				const eventName = parse(file).name;

				if (event.once) {
					client.once(eventName, (...args) => event.execute(...args, client));
				} else {
					client.on(eventName, (...args) => event.execute(...args, client));
				}
			});
		}
	});
};
