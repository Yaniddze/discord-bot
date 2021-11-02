import { MessageSelectMenu, MessageEmbed } from 'discord.js';

export const createDefaultMenuSelector = (customId, rolesToSelect) => ({
	data: new MessageSelectMenu()
		.setCustomId(customId)
		.setPlaceholder('Выбери себе роль(-и)')
		.setMinValues(0)
		.setMaxValues(rolesToSelect.length)
		.addOptions(rolesToSelect),
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
});
