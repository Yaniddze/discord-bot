import glob from 'glob';

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
			const { default: interaction } = await import(`../../${file}`);

			client[typeInteraction].set(interaction.data[identificationField], interaction);
		});
	});
};
