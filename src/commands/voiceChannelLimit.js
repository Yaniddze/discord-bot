import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('voice-channel-limit')
		.setDescription('Установить лимит пользователей для частного голосового канала')
		.addIntegerOption((option) =>
			option.setName('limit').setDescription('Количество пользователей').setRequired(true),
		),
	async execute(client, interaction) {
		try {
			const userHasAdmin = interaction.member.permissions.has('ADMINISTRATOR');
			const targetChannel = interaction.member.voice;

			if (!targetChannel.channelId) {
				return await interaction.reply({
					content: `${client.emoji.usageError} Создайте частный голосовой канал`,
					ephemeral: true,
				});
			}

			if (!userHasAdmin) {
				const isUserChannel = client.guildUserChannels.has(interaction.user.id);

				if (!isUserChannel) {
					return await interaction.reply({
						content: `${client.emoji.usageError} Вы не являетесь владельцем голосовой канала`,
						ephemeral: true,
					});
				}
			}

			const userLimit = {
				min: userHasAdmin ? 0 : 2,
				max: userHasAdmin ? 1000 : 30,
				now: await targetChannel.channel.userLimit,
				new: await interaction.options.getInteger('limit'),
			};

			if (userLimit.now === userLimit.new) {
				return await interaction.reply({
					content: `${client.emoji.usageQuestion} Зачем менять лимит пользователей голосового канала на идентичное`,
					ephemeral: true,
				});
			}

			if (userLimit.new < userLimit.min || userLimit.new > userLimit.max) {
				return await interaction.reply({
					content: `${client.emoji.usageError} Укажите диапазон от ${userLimit.min} до ${userLimit.max} пользователей`,
					ephemeral: true,
				});
			}

			await targetChannel.channel.setUserLimit(userLimit.new > 99 ? 0 : userLimit.new);

			return await interaction.reply({
				content: `${client.emoji.usageSuccessful} Лимит пользователей голосового канала изменен`,
				ephemeral: true,
			});
		} catch (err) {
			console.error(err);

			return await interaction.reply({
				content: `${client.emoji.statusError} При выполнении команды произошла ошибка`,
				ephemeral: true,
			});
		}
	},
};
