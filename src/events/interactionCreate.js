export default {
	async execute(client, interaction) {
		if (interaction.isCommand()) {
			const { commandName } = interaction;

			if (!client.commands.has(commandName)) return;

			try {
				await client.commands.get(commandName).execute(client, interaction);
			} catch (err) {
				console.error(err);

				return interaction.reply({
					content: `${client.emoji.statusError} При выполнении команды произошла ошибка`,
					ephemeral: true,
				});
			}
		}
	},
};
