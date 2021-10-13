import { Constants } from 'discord.js';
import { pool } from '../database.js';

export default {
	data: {
		name: 'channel-name',
		description: 'Установить наименование для канала',
		options: [
			{
				name: 'name',
				description: 'Наименование канала',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.STRING,
			},
		],
	},
	async execute(interaction) {
		try {
			const userHasAdmin = await interaction.member.permissions.has('ADMINISTRATOR');
			const targetChannel =
				userHasAdmin && !interaction.member.voice.channelId
					? interaction.channel
					: interaction.member.voice.channel;

			if (!userHasAdmin && !interaction.member.voice.channelId) {
				return await interaction.reply({
					content: `⛔ Создайте свой голосовой канал`,
					ephemeral: true,
				});
			}

			const channelName = {
				minLength: 2,
				maxLength: 56,
				now: targetChannel.name,
				new: await interaction.options.getString('name'),
			};

			if (!userHasAdmin) {
				const {
					rows: [userChannel],
				} = await pool.query('SELECT "nameChangeTime" FROM "userChannels" WHERE "userId" = $1', [
					interaction.user.id,
				]);

				if (!userChannel) {
					return await interaction.reply({
						content: '⛔ Вы не можете использовать данную команду',
						ephemeral: true,
					});
				}

				// if (userChannel.nameChangeTime)
			}

			if (channelName.now === channelName.new) {
				return await interaction.reply({
					content: `❓ Зачем менять наименование канала на идентичное`,
					ephemeral: true,
				});
			}

			if (channelName.new.length < channelName.minLength || channelName.new.length > channelName.maxLength) {
				return await interaction.reply({
					content: `⛔ Укажите наименование, в диапазоне от ${channelName.minLength} до ${channelName.maxLength} символов`,
					ephemeral: true,
				});
			}

			const dateNow = new Date();

			await targetChannel.setName(channelName.new);

			await pool.query('UPDATE "userChannels" SET "nameChangeTime" = $1 WHERE "channelId" = $2', [
				dateNow.getTime(),
				targetChannel.id,
			]);

			return await interaction.reply({
				content: `✅ Наименование канала изменено`,
				ephemeral: true,
			});
		} catch (err) {
			console.error(err);
			return await interaction.reply({ content: '⚠️ При выполнении команды произошла ошибка', ephemeral: true });
		}
	},
};
