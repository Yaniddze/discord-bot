import { SlashCommandBuilder } from '@discordjs/builders';
import { checkAdminPermissions } from '../utils/permissions';
import { availableEmoji } from '../utils/emoji';

export default {
	data: new SlashCommandBuilder()
		.setName('voice-channel-limit')
		.setDescription('Установить лимит пользователей для частного голосового канала')
		.addIntegerOption((option) =>
			option.setName('limit').setDescription('Количество пользователей').setRequired(true),
		),
	async execute(client, interaction, reply) {
		const userHasAdmin = checkAdminPermissions(interaction);
		const targetChannel = interaction.member.voice;

		if (!targetChannel.channelId) {
			return reply(`${availableEmoji.usageError} Создайте частный голосовой канал`);
		}

		if (!userHasAdmin) {
			const isUserChannel = client.guildUserChannels.has(interaction.user.id);

			if (!isUserChannel) {
				return await reply(`${availableEmoji.usageError} Вы не являетесь владельцем голосовой канала`);
			}
		}

		const userLimit = {
			min: userHasAdmin ? 0 : 2,
			max: userHasAdmin ? 1000 : 30,
			now: await targetChannel.channel.userLimit,
			new: await interaction.options.getInteger('limit'),
		};

		if (userLimit.now === userLimit.new) {
			return await reply(
				`${availableEmoji.usageQuestion} Зачем менять лимит пользователей голосового канала на идентичное`,
			);
		}

		if (userLimit.new < userLimit.min || userLimit.new > userLimit.max) {
			return await reply(
				`${availableEmoji.usageError} Укажите диапазон от ${userLimit.min} до ${userLimit.max} пользователей`,
			);
		}

		await targetChannel.channel.setUserLimit(userLimit.new > 99 ? 0 : userLimit.new);

		return await reply(`${availableEmoji.usageSuccessful} Лимит пользователей голосового канала изменен`);
	},
};
