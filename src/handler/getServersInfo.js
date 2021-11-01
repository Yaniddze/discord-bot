export const getServersInfo = (client) => {
	const guilds = client.guilds.cache;

	guilds.map((guild) => {
		const guildChannels = guild.channels.cache;

		guildChannels.map((channel) => {
			if (channel.type !== 'GUILD_CATEGORY' && channel.type !== 'GUILD_NEWS') {
				client.guildChannels.set(channel.id, {
					id: channel.id,
					type: channel.type,
					parent: channel.parentId,
					isInteractionChannel: channel.bitrate === 8000 ? true : false,
				});
			}
		});
	});
};
