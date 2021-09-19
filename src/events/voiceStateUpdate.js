import { pool } from '../database.js';

export default {
	async execute(oldState, newState, client) {
		try {
			if (newState.channelId) {
				const {
					rows: [channelCreate],
				} = await pool.query(
					'SELECT "id" FROM "channels" WHERE "guildId" = $1 AND "id" = $2 AND "button" = true',
					[newState.guild.id, newState.channelId],
				);

				if (channelCreate) {
					const user = newState.member.user;
					const guildChannels = newState.guild.channels;

					const userChannel = await guildChannels.create(`${user.username} channel`, {
						type: 'GUILD_VOICE',
						userLimit: newState.channel.userLimit,
						parent: newState.channel.parentId || null,
					});

					await newState.setChannel(userChannel);

					await pool.query('INSERT INTO "userChannels" ("userId", "channelId") values ($1, $2)', [
						user.id,
						userChannel.id,
					]);
				}
			}

			if (oldState.channelId) {
				const {
					rows: [{ exists: channelCreate }],
				} = await pool.query('SELECT EXISTS(SELECT FROM "userChannels" WHERE "channelId" = $1)', [
					oldState.channelId,
				]);

				if (channelCreate) {
					if (oldState.channel.members.size === 0) {
						await oldState.channel.delete();

						await pool.query('DELETE FROM "userChannels" WHERE "channelId" = $1', [oldState.channelId]);
					} else {
						const newOwner = oldState.channel.members.first();

						await pool.query('UPDATE "userChannels" SET "userId" = $1 WHERE "channelId" = $2', [
							newOwner.id,
							oldState.channelId,
						]);

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
