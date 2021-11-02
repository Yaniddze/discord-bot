import { availableEmoji } from '../utils/emoji';

export const baseExecute = (customExecute) => {
	return async (client, interaction) => {
		const reply = (message) =>
			interaction.reply({
				content: message,
				ephemeral: true,
			});

		try {
			await customExecute(client, interaction, reply);
		} catch (e) {
			console.error(err);

			return await reply(`${availableEmoji.statusError} При выполнении команды произошла ошибка`);
		}
	};
};
