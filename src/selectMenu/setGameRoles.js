import { MessageSelectMenu, MessageEmbed } from 'discord.js';

export default {
	data: new MessageSelectMenu()
		.setCustomId('setGameRoles')
		.setPlaceholder('Выбери себе роль(-и)')
		.setMinValues(0)
		.setMaxValues(5)
		.addOptions([
			{
				label: 'Grand Theft Auto V',
				value: '902319455110070344',
				emoji: '💪🏿',
			},
			{
				label: 'Dota 2',
				value: '876861612324180038',
				emoji: '🔥',
			},
			{
				label: 'Counter-Strike: Global Offensive',
				value: '876862799073144872',
				emoji: '💣',
			},
			{
				label: 'Path of Exile',
				value: '902313925213831178',
				emoji: '🏹',
			},
			{
				label: 'Vampire: The Masquerade - Bloodhunt',
				value: '888812136116154408',
				emoji: '🩸',
			},
		]),
	async execute(client, interaction) {
		const selectRoles = interaction.values;
		const selectRolesMap = new Map();
		const menuRoles = client.selectMenu.get(interaction.customId).data.options.map((option) => option.value);
		const userRoles = interaction.member.roles;
		const addRoles = [];
		const removeRoles = [];
		let embedMessage = '';

		selectRoles.map((selectRole) => {
			selectRolesMap.set(selectRole, interaction.member.guild.roles.cache.get(selectRole));
		});

		menuRoles.map(async (menuRole) => {
			const hasRole = userRoles.cache.get(menuRole);
			const hasRoleSelect = selectRolesMap.get(menuRole);

			if (!hasRole && hasRoleSelect) {
				addRoles.push(hasRoleSelect);
				await userRoles.add(menuRole);
			}

			if (hasRole && !hasRoleSelect) {
				removeRoles.push(hasRole);
				await userRoles.remove(menuRole);
			}
		});

		if (addRoles.length === 1) {
			embedMessage += `Роль добавлена: ${addRoles}.`;
		} else if (addRoles.length > 0) {
			embedMessage += `Роли добавлены: ${addRoles.join(', ')}.`;
		}

		if (removeRoles.length === 1) {
			embedMessage += `Роль удалена: ${removeRoles}.`;
		} else if (removeRoles.length > 0) {
			embedMessage += `Роли удалены: ${removeRoles.join(', ')}.`;
		}

		const answerEmbed = new MessageEmbed().setDescription(embedMessage).setColor(client.config.mainColor);

		return await interaction.reply({
			embeds: [answerEmbed],
			ephemeral: true,
		});
	},
};
