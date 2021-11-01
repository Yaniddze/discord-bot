export default {
	async execute(client, oldState, newState) {
		try {
			if (newState.channelId) {
				const { isInteractionChannel } = client.guildChannels.get(newState.channelId) || false;

				if (isInteractionChannel) {
					const user = newState.member.user;
					const guildChannels = newState.guild.channels;

					const userChannel = await guildChannels.create(`${user.username} channel`, {
						type: 'GUILD_VOICE',
						userLimit: newState.channel.userLimit,
						parent: newState.channel.parentId || null,
					});

					await newState.setChannel(userChannel);

					client.guildUserChannels.set(userChannel.id, {
						id: newState.channelId,
						userId: user.id,
						nameLimit: false,
					});
				}
			}

			if (oldState.channelId) {
				const userChannel = client.guildUserChannels.get(oldState.channelId);

				if (userChannel) {
					if (oldState.channel.members.size === 0) {
						await oldState.channel.delete();
						client.guildUserChannels.delete(oldState.channelId);
					} else {
						const newOwner = oldState.channel.members.first();

						client.guildUserChannels.set(oldState.channelId, {
							id: oldState.channelId,
							userId: newOwner.id,
							nameLimit: userChannel.nameLimit,
						});

						// API limitation - 2 requests per 10 minutes
						// oldState.channel.edit({ name: `${newOwner.user.username} channel` });
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	},
};
