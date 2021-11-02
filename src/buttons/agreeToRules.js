import { MessageButton } from 'discord.js';
import { availableEmoji } from '../utils/emoji';

export default {
	data: new MessageButton()
		.setCustomId('agreeToRules')
		.setLabel('Я ознакомился(-лась) с правилами сервера')
		.setStyle('SUCCESS'),
	async execute(client, interaction, reply) {
		const mainRoleId = client.config.mainRoleId;
		const mainRole = interaction.member.guild.roles.cache.get(mainRoleId);
		const userMainRole = interaction.member.roles.cache.get(mainRoleId);

		if (userMainRole) {
			return await reply(`${availableEmoji.usageError} Вы уже приняли правила`);
		}

		await interaction.member.roles.add(mainRole);

		return await reply(`${availableEmoji.usageSuccessful} Добро пожаловать на сервер`);
	},
};
