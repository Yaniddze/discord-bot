import { pool } from '../database.js';

export const getServersInfo = async (client) => {
	try {
		await pool.query('TRUNCATE "guilds" RESTART IDENTITY CASCADE');

		const guilds = await client.guilds.cache;

		await guilds.map(async (guild) => {
			const guildChannels = await guild.channels.cache;

			await pool.query('INSERT INTO "guilds" ("id", "afkChannel") VALUES ($1, $2)', [
				guild.id,
				guild.afkChannelId,
			]);

			await guildChannels.map(async (channel) => {
				if (channel.type !== 'GUILD_CATEGORY') {
					const channelCreate = channel.bitrate === 8000 ? true : false;

					await pool.query(
						'INSERT INTO "channels" ("id", "guildId", "type", "categoryId", "button") VALUES ($1, $2, $3, $4, $5)',
						[channel.id, guild.id, channel.type, channel.parentId, channelCreate],
					);
				}
			});
		});
	} catch (err) {
		console.error(err);
	}
};
