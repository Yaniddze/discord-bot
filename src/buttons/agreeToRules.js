import { MessageButton } from 'discord.js';

export default {
	data: new MessageButton()
		.setCustomId('agreeToRules')
		.setLabel('Я ознакомился(-лась) с правилами сервера')
		.setStyle('SUCCESS'),
	async execute(client, interaction) {
		const mainRoleId = client.config.mainRoleId;
		const mainRole = interaction.member.guild.roles.cache.get(mainRoleId);
		const userMainRole = interaction.member.roles.cache.get(mainRoleId);

		if (userMainRole) {
			return await interaction.reply({
				content: `${client.emoji.usageError} Вы уже приняли правила`,
				ephemeral: true,
			});
		}

		await interaction.member.roles.add(mainRole);

		return await interaction.reply({
			content: `${client.emoji.usageSuccessful} Добро пожаловать на сервер`,
			ephemeral: true,
		});
	},
};
