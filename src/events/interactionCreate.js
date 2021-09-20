export default {
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const { commandName } = interaction;

			if (!client.commands.has(commandName)) return;

			try {
				await client.commands.get(commandName).execute(interaction);
			} catch (err) {
				console.error(err);
				return interaction.reply({
					content: '⚠️ При выполнении команды произошла ошибка',
					ephemeral: true,
				});
			}
		}
	},
};
