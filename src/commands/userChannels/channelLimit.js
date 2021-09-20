import { Constants } from 'discord.js';
import { pool } from '../../database.js';

export default {
	data: {
		name: 'channel-limit',
		description: 'Установить лимит пользователей для вашего канала',
		options: [
			{
				name: 'limit',
				description: 'Количество пользователей',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.NUMBER,
			},
		],
	},
	async execute(interaction) {
		try {
			const userHasAdmin = await interaction.member.permissions.has('ADMINISTRATOR');
			const userLimit = {
				min: userHasAdmin ? 0 : 2,
				max: userHasAdmin ? 99 : 30,
				now: await interaction.member.voice.channel.userLimit,
				arg: await interaction.options.getInteger('limit'),
			};

			const {
				rows: [{ exists: userChannel }],
			} = await pool.query('SELECT EXISTS(SELECT FROM "userChannels" WHERE "userId" = $1)', [
				interaction.user.id,
			]);

			if (!userChannel && !userHasAdmin) {
				return await interaction.reply({
					content: '⛔ Вы не можете использовать данную команду',
					ephemeral: true,
				});
			}

			if (userLimit.now === userLimit.arg) {
				return await interaction.reply({
					content: `❓ Сейчас лимит пользователей и так составляет ${userLimit.now}`,
					ephemeral: true,
				});
			}

			if (userLimit.arg < userLimit.min || userLimit.arg > userLimit.max) {
				return await interaction.reply({
					content: `⛔ Выберите диапазон от ${userLimit.min} до ${userLimit.max} пользователей`,
					ephemeral: true,
				});
			}

			await interaction.member.voice.channel.setUserLimit(userLimit.arg);

			return await interaction.reply({
				content: `✅ Лимит пользователей изменен на ${userLimit.arg}`,
				ephemeral: true,
			});
		} catch (err) {
			console.error(err);
			return await interaction.reply({ content: '⚠️ При выполнении команды произошла ошибка', ephemeral: true });
		}
	},
};
