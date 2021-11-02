import { SlashCommandBuilder } from '@discordjs/builders';
import { checkAdminPermissions } from '../utils/permissions';
import { availableEmoji } from '../utils/emoji';

export default {
	data: new SlashCommandBuilder()
		.setName('voice-channel-name')
		.setDescription('Установить наименование для частного голосового канала')
		.addStringOption((option) => option.setName('name').setDescription('Наименование канала').setRequired(true)),
	async execute(client, interaction, reply) {
		const userHasAdmin = checkAdminPermissions(interaction);
		const targetChannel = interaction.member.voice;

		if (!targetChannel.channelId) {
			return await reply(`${availableEmoji.usageError} Создайте частный голосовой канал`);
		}

		const { userId, nameLimit } = client.guildUserChannels.get(targetChannel.channelId) || false;

		if (!userHasAdmin && userId !== interaction.user.id) {
			return await reply(`${availableEmoji.usageError} Вы не являетесь владельцем голосовой канала`);
		}

		if (nameLimit) {
			return await reply(`${availableEmoji.usageError} Голосовой канал уже был переименован`);
		}

		const channelName = {
			minLength: 2,
			maxLength: 56,
			now: targetChannel.channel.name,
			new: await interaction.options.getString('name'),
		};

		if (channelName.now === channelName.new) {
			return await reply(
				`${availableEmoji.usageQuestion} Зачем менять наименование голосового канала на идентичное`,
			);
		}

		if (channelName.new.length < channelName.minLength || channelName.new.length > channelName.maxLength) {
			return await reply(
				`${availableEmoji.usageError} Укажите наименование, в диапазоне от ${channelName.minLength} до ${channelName.maxLength} символов`,
			);
		}

		await targetChannel.channel.setName(channelName.new);

		await client.guildUserChannels.set(interaction.member.voice.channelId, {
			userId: interaction.user.id,
			nameLimit: true,
		});

		return await reply(`${availableEmoji.usageSuccessful} Наименование голосового канала изменено`);
	},
};
