export const registeringCommands = (client) => {
	const guildTestId = client.config.guildTestId;
	const commandsArray = [];

	client.commands.map((command) => {
		commandsArray.push(command.data);
	});

	if (guildTestId) {
		client.guilds.cache.get(guildTestId).commands.set(commandsArray);
	} else {
		client.application.commands.set(commandsArray);
	}
};
