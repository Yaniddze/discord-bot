import { availableEmoji } from '../utils/emoji';
/**
 * @param {String} typeInteraction
 * @param {String} identificationField
 */
async function interactionExecute(client, interaction, typeInteraction, identificationField = 'customId') {
	const interactionId = interaction[identificationField];

	if (!client[typeInteraction].has(interactionId)) return;

	try {
		await client[typeInteraction].get(interactionId).execute(client, interaction);
	} catch (err) {
		console.error(err);

		return interaction.reply({
			content: `${availableEmoji.statusError} При выполнении произошла ошибка`,
			ephemeral: true,
		});
	}
}

export default {
	async execute(client, interaction) {
		if (interaction.isCommand()) {
			return interactionExecute(client, interaction, 'commands', 'commandName');
		}

		if (interaction.isButton()) {
			return interactionExecute(client, interaction, 'buttons');
		}

		if (interaction.isSelectMenu()) {
			return interactionExecute(client, interaction, 'selectMenu');
		}
	},
};
