export const registeringCommands = (client) => {
	const guildId = client.config.guildId;
	const commandsArray = [];

	client.commands.map((command) => {
		commandsArray.push(command.data);
	});

	client.guilds.cache.get(guildId).commands.set(commandsArray);
};
