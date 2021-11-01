import glob from 'glob';

export const connectingCommands = (client) => {
	glob('./src/commands/**/*.js', (err, files) => {
		if (err) {
			return console.error(err);
		}

		files.map(async (file) => {
			const {
				default: command,
				default: {
					data: { name: commandName },
				},
			} = await import(`../../${file}`);

			client.commands.set(commandName, command);
		});
	});
};
