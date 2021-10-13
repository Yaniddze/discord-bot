import { Constants } from 'discord.js';
import { pool } from '../database.js';

export default {
	data: {
		name: 'voice-channel-limit',
		description: 'Установить лимит пользователей для голосового канала',
		options: [
			{
				name: 'limit',
				description: 'Количество пользователей',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.INTEGER,
			},
		],
	},
	async execute(interaction) {
		try {
			const userHasAdmin = await interaction.member.permissions.has('ADMINISTRATOR');

			if (!interaction.member.voice.channelId) {
				const messageError = userHasAdmin ? 'Войдите в голосовой канал' : 'Создайте свой голосовой канал';
				return await interaction.reply({
					content: `⛔ ${messageError}`,
					ephemeral: true,
				});
			}

			const userLimit = {
				min: userHasAdmin ? 0 : 2,
				max: userHasAdmin ? 99 : 30,
				now: await interaction.member.voice.channel.userLimit,
				new: await interaction.options.getInteger('limit'),
			};

			if (!userHasAdmin) {
				const {
					rows: [{ exists: userChannel }],
				} = await pool.query('SELECT EXISTS(SELECT FROM "userChannels" WHERE "userId" = $1)', [
					interaction.user.id,
				]);

				if (!userChannel) {
					return await interaction.reply({
						content: '⛔ Вы не можете использовать данную команду',
						ephemeral: true,
					});
				}
			}

			if (userLimit.now === userLimit.new) {
				return await interaction.reply({
					content: `❓ Зачем менять лимит пользователей голосового канала на идентичное`,
					ephemeral: true,
				});
			}

			if (userLimit.new < userLimit.min || userLimit.new > userLimit.max) {
				return await interaction.reply({
					content: `⛔ Укажите диапазон от ${userLimit.min} до ${userLimit.max} пользователей`,
					ephemeral: true,
				});
			}

			await interaction.member.voice.channel.setUserLimit(userLimit.new);

			return await interaction.reply({
				content: `✅ Лимит пользователей голосового канала изменен`,
				ephemeral: true,
			});
		} catch (err) {
			console.error(err);
			return await interaction.reply({ content: '⚠️ При выполнении команды произошла ошибка', ephemeral: true });
		}
	},
};
