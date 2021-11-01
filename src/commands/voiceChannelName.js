import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('voice-channel-name')
		.setDescription('Установить наименование для частного голосового канала')
		.addStringOption((option) => option.setName('name').setDescription('Наименование канала').setRequired(true)),
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

			const { userId, nameLimit } = client.guildUserChannels.get(targetChannel.channelId) || false;

			if (!userHasAdmin && userId !== interaction.user.id) {
				return await interaction.reply({
					content: `${client.emoji.usageError} Вы не являетесь владельцем голосовой канала`,
					ephemeral: true,
				});
			}

			if (nameLimit) {
				return await interaction.reply({
					content: `${client.emoji.usageError} Голосовой канал уже был переименован`,
					ephemeral: true,
				});
			}

			const channelName = {
				minLength: 2,
				maxLength: 56,
				now: targetChannel.channel.name,
				new: await interaction.options.getString('name'),
			};

			if (channelName.now === channelName.new) {
				return await interaction.reply({
					content: `${client.emoji.usageQuestion} Зачем менять наименование голосового канала на идентичное`,
					ephemeral: true,
				});
			}

			if (channelName.new.length < channelName.minLength || channelName.new.length > channelName.maxLength) {
				return await interaction.reply({
					content: `${client.emoji.usageError} Укажите наименование, в диапазоне от ${channelName.minLength} до ${channelName.maxLength} символов`,
					ephemeral: true,
				});
			}

			await targetChannel.channel.setName(channelName.new);

			await client.guildUserChannels.set(interaction.member.voice.channelId, {
				userId: interaction.user.id,
				nameLimit: true,
			});

			return await interaction.reply({
				content: `${client.emoji.usageSuccessful} Наименование голосового канала изменено`,
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
