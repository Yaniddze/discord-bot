import glob from 'glob';

export const connectingCommands = (client) => {
	glob('./src/commands/**/*.js', (err, files) => {
		if (err) {
			console.error(err);
		} else {
			files.map(async (file) => {
				const { default: command } = await import(`../../${file}`);

				client.commands.set(command.data.name, command);
			});
		}
	});
};
