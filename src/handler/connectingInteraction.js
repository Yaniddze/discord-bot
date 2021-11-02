import glob from 'glob';
import { baseExecute } from './baseExecute';

/**
 * @param {String} typeInteraction
 * @param {String} identificationField
 */

export const connectingInteraction = (client, typeInteraction, identificationField = 'customId') => {
	glob(`./src/${typeInteraction}/**/*.js`, (err, files) => {
		if (err) {
			return console.error(err);
		}

		files.map(async (file) => {
			const interaction = await import(`../../${file}`);

			client[typeInteraction].set(interaction.data[identificationField], {
				...interaction,
				execute: baseExecute(interaction.execute),
			});
		});
	});
};
